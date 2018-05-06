<script>
import './userInfoItem.less'
export default {
  render: function (h) {
    return (
      <div class="userInfoItem">
        <div class="userInfoItem-left">
          <p>{this.name}</p>
          <div>
            {typeof this.value === 'function' ? this.value(h) : this.value}
          </div>
        </div>
        <img class="blackArrow" src={this.blackArrow} />
      </div>
    )
  },
  data: function () {
    return {
      blackArrow: require('../assets/jiantou.png')
    }
  },
  props: ['name', 'value']
}
</script>
