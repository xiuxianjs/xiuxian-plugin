import './task/index'
export default defineChildren(() => ({
  async onCreated() {
    console.info('修仙机器人开启')
  }
}))
