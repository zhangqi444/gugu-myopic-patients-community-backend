const Service = require('egg').Service;
const OSS = require('ali-oss');
const crypto = require("crypto-js");

class AliyunService extends Service {

  constructor(ctx) {
    super(ctx);
    const { config } = this;
    this.timeOut = config.timeout || 1; // 限制参数的生效时间(单位：小时)。
    this.maxSize = config.maxSize || 10; // 限制上传文件大小(单位：MB)。
    this.accessKeyId = config.aliyun.accessKeyId;
    this.accessKeySecret = config.aliyun.accessKeySecret;
    this.region = config.aliyun.region;
    this.bucket = config.aliyun.bucket;
    this.client = new OSS({
      region: this.region,
      accessKeyId: this.accessKeyId,
      accessKeySecret: this.accessKeySecret,
      bucket: this.bucket,
    });
  }

  signature() {
    const policy = this._getPolicyBase64();
    const signature = this._signature(policy);
    return {
      OSSAccessKeyId: this.accessKeyId,
      policy: policy,
      signature: signature,
    };
  }

  _getPolicyBase64() {
    let date = new Date();
    // 设置policy过期时间。
    date.setHours(date.getHours() + this.timeOut);
    let srcT = date.toISOString();
    const policyText = {
      expiration: srcT,
      conditions: [
        // 限制上传文件大小。
        ["content-length-range", 0, this.maxSize * 1024 * 1024],
      ],
    };
    const buffer = new Buffer(JSON.stringify(policyText));
    return buffer.toString("base64");
  }

  _signature(policy) {
    return crypto.enc.Base64.stringify(
      crypto.HmacSHA1(policy, this.accessKeySecret)
    );
  }

  _randomString(len) {
    len = len || 32;
    const chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
    const maxPos = chars.length;
    let pwd = '';
    for (let i = 0; i < len; i++) {
      pwd += chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
  }

  async put(buffer, name) {
    try {
      const randomFilePrefix = this._randomString(20);
      // object-name可以自定义为文件名（例如file.txt）或目录（例如abc/test/file.txt）的形式，实现将文件上传至当前Bucket或Bucket下的指定目录。
      return await this.client.put(name ? `${randomFilePrefix}_${name}` : `${randomFileName}.png`, buffer);
    } catch (e) {
      console.error(e);
    }
  }

  async putDataUrl(dataUrl, name) {
    return await this.put(this._dataURLtoBlob(dataUrl), name);
  }

  _dataURLtoBlob(dataUrl) {
    const arr = dataUrl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  }

  async list(max) {
    return await this.client.list({ 'max-key': max });
  }

  async delete(object) {
    return await this.client.delete(object);
  }

  async putSignatureUrl(name) {
    try {
      const randomFilePrefix = this._randomString(20);
      const fileName = name ? `${randomFilePrefix}_${name}` : `${randomFileName}.png`;

      const url = this.client.signatureUrl(fileName, {
        expires: 3600,
        method: 'PUT',
        'Content-Type': 'text/plain; charset=UTF-8',
      });
      return url;
    } catch (e) {
      console.error(e);
      return
    }
  }
}

module.exports = AliyunService;