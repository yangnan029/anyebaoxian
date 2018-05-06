<template>
  <div class="newContents" @click="cancel">
    <div class="newContent-container" @click.stop>
      <button @click="sendComment()" :class="['grey',{'yellow':textValue}]">发送</button>
      <textarea name="" id="" cols="30" rows="10" autofocus="autofocus" v-model="textValue"></textarea>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import { Toast } from "mint-ui";

import { ajax, eventHub } from "../../common/ajax";
import { TOKEN } from "../../common/index";
import { getCookie } from "../../common/cookie";
export default {
  data() {
    return {
      textValue: "",
      query: this.$route.query
    };
  },
  create() {
    try {
      if (!this.query.id) {
        this.$router.go(-1);
      }
    } catch (error) {
      this.$router.go(-1);
    }
    // console.log(this.$route)
    // console.log(this.$router)
  },
  methods: {
    cancel() {
      this.$router.go(-1);
    },
    sendComment(message) {
      const _self = this;
      if (!getCookie(TOKEN)) {
        this.$router.push("/login");
        Toast({
          message: "发布话题要先登录哦!",
          position: "middle",
          duration: 2000
        });
        return;
      }
      const headersParams = {
        authorId: this.query.authoerId,
        title: this.query.title,
        commentatorId: this.query.userId        
        
      };
      const params = {
        // userId: this.query.userId,
        productCode: 'sealfinance',
        projectName: 'sealfinance',
        objectId: this.query.id,
        parentId: this.query.commitId,
        // parentAuthorId?
        toCommenter: this.query.toCommenter,
        objectType: this.query.objectType,/**评论话题为topic，评论评论为comment */
        commentDetail: escape(this.textValue),
        userName: this.query.nickName,
        imageUrls: []
      }
      ajax(
        "post",
        "/sealfinance-api/comment/insertComment",
        params,
        headersParams
      )
        .then(response => {
          let res = response.data;
          if (res.code === "100000") {
            eventHub.$emit("refresh", _self.query.id);
            _self.cancel();
          } else {
            console.log("失败");
          }
        })
        .catch(error => {
          console.log("出错啦");
        });
    }
  }
};
</script>
<style lang="less" scoped>
@import "./writeComment.less";
</style>