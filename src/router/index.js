import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/pages/index'
import Login from '@/pages/user/Login'
import CompleteInformation from '@/pages/user/CompleteInformation'
import UserInfo from '@/pages/user/UserInfo'
import ChangePhone from '@/pages/user/ChangePhone'
import ChangeNickName from '@/pages/user/ChangeNickName'
import ChangeJob from '@/pages/user/changeJob'
import MyCollected from '@/pages/user/myCollected'
import MyComment from '@/pages/user/myComment'
import MyFollow from '@/pages/user/myFollow'
import MyMessage from '@/pages/user/myMessage'
import MyTopic from '@/pages/user/myTopic'
import OtherTopic from '@/pages/user/otherTopic'
import CommentDetail from '@/pages/shequ/commentDetail'
import PublishTopic from '@/pages/shequ/publishTopic'
import SecondCommentDetail from '@/pages/shequ/secondCommentDetail'
import TopicDetail from '@/pages/shequ/topicDetail'
import allComment from '@/pages/shequ/allComment'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'index',
      component: Index,
      meta: {
        keepAlive: true // 需要被缓存
      }
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/completeInformation',
      name: 'completeInformation',
      component: CompleteInformation
    },
    {
      path: '/userInfo',
      name: 'userInfo',
      component: UserInfo
    },
    {
      path: '/changePhone',
      name: 'changePhone',
      component: ChangePhone
    },
    {
      path: '/changeNickName',
      name: 'changeNickName',
      component: ChangeNickName
    },
    {
      path: '/changeJob',
      name: 'changeJob',
      component: ChangeJob
    },
    {
      path: '/myCollected',
      name: 'myCollected',
      component: MyCollected
    },
    {
      path: '/myComment',
      name: 'myComment',
      component: MyComment
    },
    {
      path: '/myFollow',
      name: 'myFollow',
      component: MyFollow
    },
    {
      path: '/myMessage',
      name: 'myMessage',
      component: MyMessage
    },
    {
      path: '/myTopic',
      name: 'myTopic',
      component: MyTopic
    },
    {
      path: '/otherTopic',
      name: 'otherTopic',
      component: OtherTopic
    },
    {
      path: '/commentDetail',
      name: 'commentDetail',
      component: CommentDetail
    },
    {
      path: '/publishTopic',
      name: 'publishTopic',
      component: PublishTopic
    },
    {
      path: '/secondCommentDetail',
      name: 'secondCommentDetail',
      component: SecondCommentDetail
    },
    {
      path: '/allComment',
      name: 'allComment',
      component: allComment
    },
    {
      path: '/topicDetail',
      name: 'topicDetail',
      component: TopicDetail,
      children: [{
        path: 'writeComment',
        name: 'writeComment',
        component: (resolve) => require(['../pages/shequ/writeComment'], resolve)
      }]
    }
  ]
})
