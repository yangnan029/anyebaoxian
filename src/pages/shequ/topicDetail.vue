<template>
  <div class="topDetail">
    <div class="topDetail-container">
      <div class="topDetail-title">
        <x-header :left-options="{backText: ''}">详情</x-header>
      </div>
      <img class="fengetiao" src="../../assets/fengetiao.png" alt="" />
      <div class="topDetail-content">
        <div class="topic-item-header">
          <div class="topic-item-header-left">
            <img v-once :src="fetchImg(mainContent.photoUrl)" />
            <div>
              <p>{{mainContent.nickName}}</p>
              <span>{{getDateDiff(mainContent.createTime)}}发起</span>
            </div>
          </div>
          <div class="topic-item-header-right">
            <img class="jinghuaIcon" src="../../assets/jing.png" v-if="mainContent.type1=='1749'" />
            <img class="guanzhuIco" v-if="user.id != mainContent.creatorAccount" :src="mainContent.follow ? followedIcon : unFollowIcon" @click="followUser()" />
          </div>
        </div>
        <div class="topic-item-title">
          {{renderText(mainContent.title1)}}
        </div>
        <div class="topic-item-content" v-html="getDetailsHtml(renderText(mainContent.detail))"></div>
      </div>
      <img class="fengetiao" src="../../assets/fengetiao.png" alt="" />
      <div class="topDetail-comment">
        <div class="topDetail-comment-title">
          <span v-if="mainContent.type1=='1758'">最赞回答</span>
          <span v-if="mainContent.type1!='1758'">最赞评论</span>
        </div>
        <div class="topDetail-comment-item" v-for="(item,index) in commentInfos" :key="index">
          <div class="comment-item-header">
            <div class="topic-item-header-left">
              <img v-once :src="fetchImg(item.photoUrl)" />
              <div>
                <p>{{renderText(item.userName)}}</p>
                <span>{{getDateDiff(item.createTime)}}</span>
              </div>
            </div>
            <div class="topic-item-header-right">
              <span @click="favorTopic2(item)"><img class="zan" :src="item.like ?favorBtn2:unfavorBtn2" alt="" />
                <span class="number">{{item.likeCount}}</span>
              </span>
              <span @click="mainCommit(item.id,item.userId)">回复</span>
            </div>
          </div>
          <div class="comment-item-content">
            <p class="main-content">{{renderText(item.commentDetail)}}</p>
            <div class="reviews" v-if="item.slcs">
              <p v-for="(items,indexx) in item.slcs" :key="indexx" @click="mainCommit(item.id,item.userId,item.toCommenter)">
                <span  @click="mainCommit(item.id,item.userId)">{{renderText(items.replierName)}} 回复 {{renderText(items.toCommenterName)}}:</span>{{renderText(items.commentDetail)}}</p>
              <p>
                <p class="all-reviews">查看全部<img src="../../assets/sanjiao.png" alt=""></p>
            </div>
          </div>
        </div>
        <div class="more-comment" v-if="commentInfos.length>=10">
          <router-link :to="{ name: 'allComment', query: { id:id}}" tag="p">查看全部评论<span>({{getNumDiff(mainContent.commentCount)}})</span></router-link>
        </div>
      </div>
      <div class="topDetail-footer">
        <router-link :to="{ name: 'writeComment', query: { id:id,userId:user.id,authoerId: mainContent.creatorAccount,title:mainContent.title1,nickName:mainContent.nickName,objectType:'topic'}}" tag="button">写点评论吧</router-link>
        <div class="bottom-icons">
          <div :class="['icons',{'disabled':disabled}]" @click="favorTopic">
            <i><img :src="mainContent.favorByCurrUser ?favorBtn2:unfavorBtn2" alt=""></i>
            <span>赞({{mainContent.favorCount}})</span>
          </div>
          <div class="icons" @click="collectTopic">
            <i><img :src="mainContent.collectByCurrUser ? collectedBtn2 : uncollectedBtn2" alt=""></i>收藏</div>
          <div class="icons">
            <i><img class="icon3" src="../../assets/fenxiang.png" alt=""></i>分享</div>
        </div>
      </div>
    </div>
    <router-view/>
  </div>
</template>

<script>
import { XHeader } from "vux";
import { Toast } from "mint-ui";
import { favorContent, collectContent } from "../../api/topic.js";
import { followUser } from "../../api/user.js";
import { renderText, fetchImg, getDateDiff, getNumDiff } from "../../common/index";
import { ajax, eventHub } from "../../common/ajax";
export default {
  name: "topicDetail",
  data: function() {
    return {
      msg: "topicDetail",
      id: this.$route.query.id,
      disabled: false,
      topicIds: [],
      mainContent: {
        nickName: "",
        title1: "",
        detail: ""
      },
      msgs: {},
      favorBtn2: require("../../assets/yizan.png"),
      unfavorBtn2: require("../../assets/zan.png"),
      collectedBtn2: require("../../assets/yishoucang.png"),
      uncollectedBtn2: require("../../assets/shoucang-.png"),
      followedIcon: require("../../assets/yiguanzhu.png"),
      unFollowIcon: require("../../assets/weiguanzhu.png"),
      commentInfos: []
    };
  },
  components: {
    XHeader
  },
  created() {
    /* 注册一个刷新事件 */
    eventHub.$on("refresh", this.getCommentLists);
    this.getTopicDetails();
    this.getCommentLists();
  },
  computed: {
    user: function() {
      return this.$store.state.user.user;
    }
  },
  destroyed() {
    eventHub.$off("refresh", this.getCommentLists);
  },
  methods: {
    mainCommit(id,userId) {
      this.$router.push({
        name: "writeComment",
        query: {
          id: this.id,
          commitId:id,
          userId:userId,
          authoerId: this.mainContent.creatorAccount,
          title: this.mainContent.title1,
          nickName: this.mainContent.nickName,
          objectType: 'comment',
        }
      });
    },
    getTopicDetails() {
      ajax("post", "/sealfinance-api/topic/selectTopicDetail", {
        topicIds: [this.id]
      }).then(resp => {
        this.mainContent = resp.data.data.contents[0].mainContent;
      });
    },
    getCommentLists(id) {
      const _self = this;
      ajax("post", "/sealfinance-api/comment/selectCommentList", {
        objectType: "topic",
        pageNum: 1,
        secondPageNum: 1,
        sortWay: "favorCount",
        topicId: id ? id : _self.$route.query.id
      }).then(resp => {
        _self.commentInfos = resp.data.data.commentInfos;
      });
    },
    renderText: renderText,
    fetchImg: fetchImg,
    getDateDiff: getDateDiff,
    getNumDiff: getNumDiff,
    getDetailsHtml(strHtml) {
      const _self = this;
      let newHtml = "";
      let imgReg = /<img.*?(?:>|\/>)/gi;
      let srcReg = /src=["]?([^"]*)["]?/i;
      let fileNameReg = /fileName=["]?([^"]*)["]?/i;
      if (imgReg.test(strHtml)) {
        newHtml = strHtml.replace(imgReg, function(match) {
          let newHtml = match.replace(fileNameReg, "$1");
          let url = RegExp.$1;
          newHtml = match.replace(srcReg, 'src="' + _self.fetchImg(url) + '"');
          return newHtml;
        });
      }
      return newHtml || strHtml;
    },
    collectSuccess: function(res) {
      this.mainContent.collectByCurrUser = !this.mainContent.collectByCurrUser;
    },
    collectFail: function(err) {
      err.message &&
        Toast({
          message: err.message,
          position: "middle",
          duration: 2000
        });
    },
    collectTopic: function() {
      if (+this.user.id === +this.mainContent.creatorAccount) {
        Toast({
          message: "不能收藏自己的哦！",
          position: "middle",
          duration: 1000
        });
        return;
      }
      let mainContent = this.mainContent;
      let msg = {};
      msg.id = mainContent.id;
      msg.type = 1;
      msg.title = mainContent.title1;
      msg.creatorAccount = mainContent.creatorAccount;
      msg.selectedTag = [];
      // TODO:获取selectedTag
      if (!mainContent.collectByCurrUser) {
        msg.collect = true;
      } else {
        msg.collect = false;
      }
      collectContent(msg, this.collectSuccess.bind(this), this.collectFail);
    },
    followSuccess: function(res) {
      this.mainContent.follow = !this.mainContent.follow;
    },
    followFail: function(err) {
      err.message &&
        Toast({
          message: err.message,
          position: "middle",
          duration: 2000
        });
    },
    followUser: function() {
      let mainContent = this.mainContent;
      let msg = {};
      msg.follow = !mainContent.follow;
      msg.creatorAccount = mainContent.creatorAccount;
      followUser(msg, this.followSuccess.bind(this), this.followFail);
    },
    favorSuccess: function(res) {
      this.mainContent.favorByCurrUser = true;
      this.mainContent.favorCount += 1;
      this.disabled = false;
    },
    favorFail: function(err) {
      err.message &&
        Toast({
          message: err.message,
          position: "middle",
          duration: 2000
        });
      this.disabled = false;
    },
    favorTopic: function() {
      if (+this.user.id === +this.mainContent.creatorAccount) {
        Toast({
          message: "不能给自己点赞哦！",
          position: "middle",
          duration: 1000
        });
        return;
      }
      this.disabled = true;
      let mainContent = this.mainContent;
      if (!mainContent.favorByCurrUser) {
        let msg = {};
        msg.id = mainContent.id;
        msg.type = 1;
        msg.title = mainContent.title1;
        msg.creatorAccount = mainContent.creatorAccount;
        favorContent(msg, this.favorSuccess.bind(this), this.favorFail);
      }
    },
    favorSuccess2: function(item, res) {
      console.log(item.likeCount);
      item.like = true;
      item.likeCount += 1;
    },
    favorFail2: function(err) {
      err.message &&
        Toast({
          message: err.message,
          position: "middle",
          duration: 2000
        });
    },
    favorTopic2(item) {
      if (+this.user.id === +this.mainContent.creatorAccount) {
        Toast({
          message: "不能给自己点赞哦！",
          position: "middle",
          duration: 1000
        });
        return;
      }
      if (!item.like) {
        console.log(item);
        let msg = {
          id: item.id,
          type: 0,
          title : this.mainContent.title1,
          creatorAccount :this.mainContent.creatorAccount
        };
        favorContent(msg, this.favorSuccess2.bind(this, item), this.favorFail2);
      }
    }
  }
};
</script>

<style lang="less" scoped>
@import "./topicDetail.less";
.disabled {
  pointer-events: none;
}
</style>