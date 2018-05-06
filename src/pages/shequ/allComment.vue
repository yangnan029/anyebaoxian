<template>
  <div class="allComment">
    <div class="allComment-container">
      <div class="allComment-title">
        <x-header :left-options="{backText: ''}">全部评论</x-header>
      </div>
      <img class="fengetiao" src="../../assets/fengetiao.png" alt="" />
      <div class="page-loadmore-wrapper" ref="wrapper" :style="{ height: wrapperHeight + 'px' }">
        <mt-loadmore :bottom-method="loadBottom" :auto-fill='false' bottomDropText="加载中" @bottom-status-change="handleBottomChange" :bottom-all-loaded="allLoaded" ref="loadmore">
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
                <span><img class="zan" :src="item.like ?favorBtn2:unfavorBtn2" alt="" />
                  <span class="number">{{item.likeCount}}</span>
                </span>
                <span>回复</span>
              </div>
            </div>
            <div class="comment-item-content">
              <p class="main-content">{{renderText(item.commentDetail)}}</p>
              <div class="reviews" v-if="item.slcs">
                <p v-for="(items,indexx) in item.slcs" :key="indexx">
                  <span>{{renderText(items.replierName)}}</span>回复
                  <span>{{renderText(items.toCommenterName)}}</span>:{{renderText(items.commentDetail)}}
                </p>
                <p>
                  <p class="all-reviews" v-if="item.slcs.length>3">查看全部<img src="../../assets/sanjiao.png" alt=""></p>
              </div>
            </div>
          </div>
          <div slot="bottom" class="mint-loadmore-bottom">
            <span v-show="bottomStatus === 'loading'" style="margin:0 auto;display:block">
              加载中……
            </span>
          </div>
          <div style="margin:0 auto;display:block">
            <span v-show="allLoaded">
              一家在全部
            </span>
          </div>
        </mt-loadmore>
        <!-- <div class="fenge-15"></div> -->
        <!-- <load-more @click.native="loadMore" :show-loading="fetching" :tip="loadTip"></load-more> -->
      </div>
    </div>

  </div>
</template>
<script>
import { XHeader } from "vux";
import { Loadmore } from "mint-ui";
import { ajax } from "../../common/ajax";
import { renderText, fetchImg, getDateDiff } from "../../common/index";
export default {
  data() {
    return {
      id: this.$route.query.id,
      fetching: true,
      pageNum: 0,
      commentInfos: [],
      wrapperHeight: 0,
      bottomStatus: false,
      allLoaded: false,
      unfavorBtn2: require("../../assets/zan.png")
    };
  },
  computed: {
    loadTip: function() {
      return this.nomore
        ? "没有更多了"
        : this.fetching ? "正在加载" : "加载更多";
    }
  },
  components: {
    XHeader,
    Loadmore
  },
  mounted() {
    this.wrapperHeight =document.documentElement.clientHeight - this.$refs.wrapper.getBoundingClientRect().top;
  },
  created() {
    this.getCommentList();
  },
  methods: {
    fetchImg: fetchImg,
    renderText: renderText,
    getDateDiff: getDateDiff,
    handleBottomChange(status) {
      this.bottomStatus = status;
    },
    loadBottom() {
      setTimeout(() => {
          this.getCommentList(true);
        this.$refs.loadmore.onBottomLoaded();
      }, 300);
      
    },
    getCommentList() {
      const _self = this;
      ajax("post", "/sealfinance-api/comment/selectCommentList", {
        objectType: "topic",
        pageNum: ++_self.pageNum,
        secondPageNum: 1,
        sortWay: "favorCount",
        topicId: _self.id
      }).then(resp => {
        const result = resp.data.data.commentInfos;
          _self.commentInfos = [..._self.commentInfos, ...result];
          if (result.length < 10) {
            _self.allLoaded = true;
          }
      });
    }
  }
};
</script>
<style lang="less" scoped>
@import "./allComment.less";
.page-loadmore-wrapper {
  padding-bottom: 5px;
}
</style>