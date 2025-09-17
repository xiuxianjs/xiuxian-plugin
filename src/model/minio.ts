import { Client } from 'minio';
import { getAppConfig } from '@src/model/Config';

// 1. 配置 MinIO 客户端
let minioClient: Client | null = null;

export const getMinioClient = () => {
  if (!minioClient) {
    const value = getAppConfig();
    const { endpoint, port, secure, access_key: accessKey, secret_key: secretKey } = value.minio;

    // 如果没有配置。直接返回null
    if (!endpoint || !accessKey || !secretKey) {
      return null;
    }

    minioClient = new Client({
      endPoint: endpoint,
      port,
      useSSL: secure,
      accessKey: accessKey,
      secretKey: secretKey
    });

    return minioClient;
  }

  return minioClient;
};

// 2. 上传文件到 MinIO
export const uploadFileToMinio = async (objectName: string, filePath: string) => {
  const client = getMinioClient();

  if (!client) {
    return {
      success: false,
      message: 'MinIO 配置不完整，无法上传文件'
    };
  }

  const value = getAppConfig();
  const { bucket_name: bucketName } = value.minio;

  try {
    // 确保桶存在
    const exists = await client.bucketExists(bucketName);

    if (!exists) {
      await client.makeBucket(bucketName, 'us-east-1');
    }

    // 上传文件
    const res = await client.fPutObject(bucketName, objectName, filePath);

    return {
      success: true,
      etag: res
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message ?? '文件上传失败'
    };
  }
};

// 得到文件的下载链接
export const createMinioURL = (objectName: string) => {
  const { bucket_name: bucketName, endpoint, port, secure } = getAppConfig().minio;
  const protocol = secure ? 'https' : 'http';
  // 80/443端口可省略
  const portPart = (protocol === 'http' && port === 80) || (protocol === 'https' && port === 443) ? '' : `:${port}`;

  return `${protocol}://${endpoint}${portPart}/${bucketName}/${objectName}`;
};
