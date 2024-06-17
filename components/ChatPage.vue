<template>
  <div class="chat-container">
    <div class="chat-box" ref="chatBox">
      <!-- 循环渲染消息列表 -->
      <div v-for="(msg, index) in messages" :key="index"
        :class="msg.role == 'assistant' ? 'ai-message' : 'user-message'">
        <svg v-if="msg.role == 'assistant'" aria-hidden="true">
          <use xlink:href="#icon-S-nongye"></use>
        </svg>
        <div class="msg">
          <div class="item" v-for="(message, index) in msg.content" :key="index">
            <img v-if="message.type == 'file_url'" :src=message.file_url.url :alt="`图片预览 ${index}`"
              class="message-image" />
            <div v-else class="message-text">{{ message.text }}</div>
          </div>
        </div>
        <svg v-if="msg.role == 'user'" aria-hidden="true">
          <use xlink:href="#icon--grinning-face"></use>
        </svg>
      </div>
    </div>
    <div v-if="imageSrcs.length" class="image-previewbox">
      <div class="imglist" v-for="(src, index) in imageSrcs" :key="index">
        <div class="sigleImg">
          <img :src="src" :alt="`图片预览 ${index}`" class="image-preview" />
          <svg @click="removeImage(index)" class="deleteImg" aria-hidden="true" width="10px" height="10px">
            <use xlink:href="#icon-shanchu"></use>
          </svg>
        </div>
      </div>
    </div>
    <div class="chat-input">
      <input type="text" v-model="inputMessage" placeholder="Enter发送，Shift + Enter换行"
        @keyup.shift.enter="handleShiftEnter" class="input-message" />
      <svg v-if=!openSetting aria-hidden="true" @click="updataSetting" width="35px" height="35px"
        style="margin-right: 10px;   cursor: pointer;">
        <use xlink:href="#icon-tianjia-"></use>
      </svg>
      <svg v-else aria-hidden="true" @click="updataSetting" width="35px" height="35px"
        style="margin-right: 10px;   cursor: pointer;">
        <use xlink:href="#icon-cha"></use>
      </svg>
      <svg v-if=!isButtonDisabled aria-hidden="true" width="35px" height="35px" style="margin-right: 10px;">
        <use xlink:href="#icon-tijiao-before"></use>
      </svg>
      <svg v-else aria-hidden="true" @click="sendMessage" width="35px" height="35px"
        style="margin-right: 10px;   cursor: pointer;">
        <use xlink:href="#icon-tijiao-after"></use>
      </svg>
    </div>
    <div class="upload" v-if=openSetting>
      <div class="leftbox">
        <input type="file" @change="handleFileChange" ref="fileInput" style="display: none;" />

        <svg @click="triggerFileInput" aria-hidden="true" width="25px" height="25px" style="  cursor: pointer;">
          <use xlink:href="#icon-shangchuantupian"></use>
        </svg>
        <span>上传图片</span>
      </div>
      <div class="rightbox">
        <svg v-if=openknow @click="updataknow" aria-hidden="true" width="25px" height="25px" style="  cursor: pointer;">
          <use xlink:href="#icon-zhishiku-open"></use>
        </svg>
        <svg v-else @click="updataknow" aria-hidden="true" width="25px" height="25px" style="  cursor: pointer;">
          <use xlink:href="#icon-zhishiku-close"></use>
        </svg>
        <span> {{ openknowtext }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      temptImage: [],
      isupload: false,
      imageSrcs: [],
      openknowtext: '打开知识库',
      openknow: false,
      openSetting: false,
      inputMessage: '',
      messages: [
      ],
      requestMes: {
        knowledge: "1797517354603782144",
        llm: { model: "glm-4", system_prompt: "", temperature: 0.95, top_p: 0.7 },
        options: {},
        services: ["service:9hqeyufx38v3bxotb0nq", "service:i684t1ivtvhv7m919rf2"]
      }
    };
  },
  computed: {
    isButtonDisabled() {
      if ((this.imageSrcs.length === 0 && this.inputMessage === "") || this.isupload)
        return false;
      else
        return true;
    },
  },
  watch: {
    messages: {
      handler() {
      },
      deep: true
    }
  },
  methods: {

    updataknow() {
      this.openknow = !this.openknow
      if (this.openknow)
        this.openknowtext = "关闭知识库"
      else
        this.openknowtext = "打开知识库"
    },
    updataSetting() {
      this.openSetting = !this.openSetting
    },
    triggerFileInput() {
      // 触发文件输入框的点击事件
      this.$refs.fileInput.click();
    },
    async handleFileChange(event) {
      // 处理文件选择后的事件
      const file = event.target.files[0];
      const reader = new FileReader();
      if (file && file.type.match('image.*')) {
        reader.readAsDataURL(file);
        reader.onload = (e) => {
          this.imageSrcs.push(e.target.result); // 设置图片预览的src
        };
        const headers = {
          "X-API-Key": "sk-b9erd8cqto9savh2v59z-3da297287fc7d81a2ae5327006b325c17234040a",
          "Content-Type": "application/json"
        }

        // 定义请求的body数据
        const data = {
          method: "PUT",
          name: file.name
        };
        // 将对象转换为JSON格式的字符串
        const body = JSON.stringify(data);
        // 发送POST请求
        var preres = await fetch("https://api.platform.archivemodel.cn/files/pre-signed-url", {
          method: "POST",
          headers: headers,
          body: body
        })
        preres = await preres.json()
        console.log(preres.url)
        // 将图片文件转换为二进制并添加到FormData对象中
        reader.readAsArrayBuffer(file);
        reader.onload = (e) => {
          const binaryData = e.target.result;
          fetch(preres.url, {
            method: 'PUT',
            body: binaryData,
          })
            .then(response => {
              // 首先检查响应的状态码
              if (response.ok) {
                // 如果状态码在200-299之间，表示请求成功
                console.log("上传成功") // 或者根据服务器返回的数据类型选择适当的方法处理响应体
              } else {
                // 如果状态码表示错误，抛出错误
                throw new Error('网络错误');
              }
            })
            .catch(error => {
              // 处理请求过程中发生的错误
              console.error('Upload failed:', error);
            });
        }
        const datas = {
          type: file.type,
          name: file.name,
          size: Number(file.size),
          object_key: preres['object_key'],
        };
        var uploadres = await fetch("https://api.platform.archivemodel.cn/files", {
          method: "POST",
          headers: headers,
          body: JSON.stringify(datas)
        });
        uploadres = await uploadres.json()
        this.temptImage.push({
          type: "file_url",
          file_url: {
            mime_type: file.type,
            name: file.name,
            size: Number(file.size),
            url: uploadres["pre_signed_url"]
          }
        })
      } else {
        alert('请选择一个图片文件！');
      }
    },
    removeImage(index) {
      this.imageSrcs.splice(index, 1)
      this.temptImage.splice(index, 1)
    },
    // 这里可以添加上传图片的方法

    async sendMessage() {
      this.isupload = true
      this.inputMessage = this.inputMessage.trim()
      // 添加用户消息
      const headers = new Headers({
        "X-API-Key": "sk-b9erd8cqto9savh2v59z-3da297287fc7d81a2ae5327006b325c17234040a",
        "Content-Type": "application/json"
      });
      this.messages.push({
        role: "user",
        content: []
      })
      //用户页面显示
      if (this.temptImage.length > 0) {
        this.messages[this.messages.length - 1].content = [...this.temptImage]
        this.temptImage = [];
      }
      if (this.inputMessage !== "") {
        this.messages[this.messages.length - 1].content.push({
          type: "text",
          text: this.inputMessage
        })
        this.inputMessage = '';
      }
      this.imageSrcs = []
      this.$nextTick(() => {
        this.$refs.chatBox.scrollTop = this.$refs.chatBox.scrollHeight;
      });
      //准备数据
      var requestBody = { ...this.requestMes }
      requestBody.messages = this.messages
      if (this.openknow) requestBody.options.retrieval = true
      //向api发请求
      const response = await fetch('https://api.platform.archivemodel.cn/assistants/query', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(requestBody)
      });
      this.messages.push({
        role: "assistant",
        content: [{ type: "text", text: "" }]
      }); // 当前正在构建的消息
      if (!response.ok) {
        setTimeout(() => {
          this.messages[this.messages.length - 1].content[0].text = "请求错误，请稍后再试！"
          this.isupload = false
          return
        }, 1000);
      }
      var reContent = ""
      const reader = response.body.getReader();
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          this.isupload = false
          break
        }
        var sigleData = new TextDecoder("utf-8").decode(value);
        let lines = sigleData.split('\n');
        lines.forEach(line => {
          if (line.trim() && line.trim().endsWith('}')) {
            line = line.replace('event: message', '');
            line = line.replace("data: ", "")
            line = JSON.parse(line);
            reContent += line.content
            this.messages[this.messages.length - 1].content[0].text = reContent
            this.$nextTick(() => {
              this.$refs.chatBox.scrollTop = this.$refs.chatBox.scrollHeight;
            });
          }
        });
      }
    },

    handleShiftEnter(event) {
      // 阻止默认的换行行为
      event.preventDefault();
      // 替换选中的文本或光标位置插入换行符
      const message = this.inputMessage;
      this.inputMessage = message.slice(0, event.target.selectionStart) + '\n' +
        message.slice(event.target.selectionEnd);
    },
  }
};
</script>

<style scoped lang="scss">
/* 整个聊天容器全屏 */
.chat-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: 0;
  padding: 0;
  background-color: #1C1C1C;
  /* background-color: #fff; */
  display: flex;
  flex-direction: column;
  justify-content: center;

}

/* 聊天头部固定在顶部 */
.chat-header {
  height: 10vh;
  /* 不受flex-grow影响 */
  margin: 0 auto;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
}

/* 聊天内容区域占满剩余空间 */
.chat-box {
  flex: 1;
  width: 100%;
  overflow-y: auto;
  padding: 10px;

  .ai-message {

    display: flex;
    flex-direction: row;
    justify-content: start;
    align-items: center;
    margin: 10px;

    .msg {
      margin-left: 10px;
      display: inline-block;
      padding: 10px;
      word-wrap: anywhere;
      max-width: 70%;
      background-color: #1A483D;
      border-radius: 10px;
      color: white;
    }

    svg {
      width: 40px;
      height: 40px;
      border-radius: 20px;
      overflow: hidden;
      object-fit: cover;
    }
  }

  .user-message {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin: 0 10px;
    justify-content: end;

    svg {
      width: 40px;
      height: 40px;
      border-radius: 20px;
      overflow: hidden;
      object-fit: cover;
    }

    .msg {
      margin-right: 10px;
      display: inline-block;
      padding: 10px;
      word-wrap: anywhere;
      max-width: 70%;
      border-radius: 10px;
      color: white;
      background-color: #1C3146;
    }
  }

  /* IE and Edge */
}



.message-image {
  width: 200px;
  /* 根据需要调整图片大小 */
}


/* 聊天输入区域固定在底部 */
.chat-input {
  flex: 0 1 auto;
  // padding: 5px;
  height: 45px;
  box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: solid 1px white;
  border-radius: 20px;
  margin: 0 5%;
  margin-bottom: 20px;
  padding-left: 10px;
}

.chat-input input {
  // min-height: 20px;
  height: 20px;
  // max-height: 20vh;
  /* border: 1px solid #ccc; */
  border-radius: 5px;
  color: white;
  background-color: #1C1C1C;
  // padding: 10px;
  flex-grow: 1;
  margin-right: 5px;
  border: none;
  outline: none;
}

.upload {
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

// ::-webkit-scrollbar {
// display: none;
// }
.rightbox,
.leftbox {
  margin: 0 50px;
  font-size: 12px;
}

.rightbox span,
.leftbox span {
  display: block;
  margin-bottom: 10px;
  margin-bottom: 30px;
}

.rightbox svg,
.leftbox svg {
  display: flex;
  flex-direction: column;
  width: 40px;
  height: 40px;
  background-color: #45454e;
  border-radius: 10px;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
}

.image-previewbox {
  padding-left: 5px;
  padding-right: 5px;
  border-radius: 20px;
  gap: 2px;
  overflow: auto;
  height: 110px;
  border: 1px white solid;
  margin: 0 5%;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  overflow: hidden;
}

.image-preview {
  object-fit: cover;
  display: block;
  width: auto;
  max-width: 100%;
  height: 100px;
  border-radius: 5px;
}

.sigleImg {
  position: relative;
}

.deleteImg {

  cursor: pointer;
  position: absolute;
  top: 0;
  right: 0;
  z-index: 10;
}
</style>