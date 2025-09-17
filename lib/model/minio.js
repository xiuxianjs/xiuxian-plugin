import { Client } from 'minio';
import { getAppConfig } from './Config.js';

let minioClient = null;
const getMinioClient = () => {
    if (!minioClient) {
        const value = getAppConfig();
        const { endpoint, port, secure, access_key: accessKey, secret_key: secretKey } = value.minio;
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
const uploadFileToMinio = async (objectName, filePath) => {
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
        const exists = await client.bucketExists(bucketName);
        if (!exists) {
            await client.makeBucket(bucketName, 'us-east-1');
        }
        const res = await client.fPutObject(bucketName, objectName, filePath);
        return {
            success: true,
            etag: res
        };
    }
    catch (error) {
        return {
            success: false,
            message: error?.message ?? '文件上传失败'
        };
    }
};
const createMinioURL = (objectName) => {
    const { bucket_name: bucketName, endpoint, port, secure } = getAppConfig().minio;
    const protocol = secure ? 'https' : 'http';
    const portPart = (protocol === 'http' && port === 80) || (protocol === 'https' && port === 443) ? '' : `:${port}`;
    return `${protocol}://${endpoint}${portPart}/${bucketName}/${objectName}`;
};

export { createMinioURL, getMinioClient, uploadFileToMinio };
