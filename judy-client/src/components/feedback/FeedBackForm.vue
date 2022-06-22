<template>
  <Card class="feedback-card" v-if="!closeCard">
        <a class="close-btn" href="#"  @click="close()">
            <Icon type="close-round"></Icon>
        </a>
        <div style="text-align:center">
            <p class="parag">Dear guest, we appreciate that you give us some of your time and fill the feedback form for this service, so to always give you the best service you desire!</p>
            <div class="rate-step">
                <div class="rate" @click="showForm(5)">
                    <img src="@/assets/img/rating/5.png" alt="rate 5">
                    <span>Excellent</span>
                </div>
                <div class="rate" @click="showForm(4)">
                    <img src="@/assets/img/rating/4.png" alt="rate 4">
                    <span>Very good</span>
                </div>
                
                <div class="rate" @click="showForm(3)">
                    <img src="@/assets/img/rating/3.png" alt="rate 3">
                    <span>Good</span>
                </div>
                <div class="rate" @click="showForm(2)">
                    <img src="@/assets/img/rating/2.png" alt="rate 2">
                    <span>Not bad</span>
                </div>
                <div class="rate" @click="showForm(1)">
                    <img src="@/assets/img/rating/1.png" alt="rate 1">
                    <span>Bad</span>
                </div>
                <div class="rate" @click="showForm(0)">
                    <img src="@/assets/img/rating/0.png" alt="rate 0">
                    <span>Very Bad</span>
                </div>
            </div>
             <Modal
                ok-text = "Done"
                cancel-text = "Cancel"
                v-model="feedbackForm"
                title="it's the last step we promise!!"
                @on-ok="done"
                @on-cancel="cancel">
                <Input v-model="feedback.message" type="textarea" placeholder="What you think about our service !! Please be honest with us"></Input>
            </Modal>
        </div>
    </Card>
</template>
<script>
import Feedback from '@/services/Feedback'
export default {
  name: 'Feedback',
  props: ['service'],
  data() {
      return {
          feedback: {
              rate: 0,
              message: '',
              service: ''
          },
          feedbackForm: false,
          closeCard: false,
      }
  },
  methods: {
      showForm(rate) {
        this.feedback.rate = rate
        this.feedbackForm = true
        this.$Message.success('One more step to go :)')
      },
      async done() {
          try {
              Feedback.post(this.feedback)
              this.$Message.success('Thank you! We realy appreciate your help <3')
              this.$store.dispatch('setFeedback', JSON.stringify(this.feedback))
              this.close()
          }catch(e) {
              this.$Message.error('Oops! Something went wrong :(')
          }
          
      },
      cancel() {
          this.$Message.error('So bad! please let us know what you think about us :(')
      },
      close() {
          this.closeCard = true
      }
  },
  mounted() {
      this.feedback.service = this.service
      console.log(this.service)
      console.log(this.$store.state.feedback.filter(x =>  JSON.parse(x).service === this.service ))
      this.closeCard = this.$store.state.feedback.filter(x => JSON.parse(x).service === this.service).length !== 0
  }
}
</script>
<style scoped>
    .rate-step {
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        margin-left: 5%
    }
    img {
        margin-top: 40px;
        height: 35px;
        width: 35px;
        opacity: 0.6;
    }
    img:hover {
        opacity: 1;
    }
    .rate-step:last-child {
        margin-bottom: 10px
    }
    .rate {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .rate span {
        font-weight: bold;
        color: #95a5a6
    }
    .title-card {
        color: #7f8c8d
    }
    .parag {
        color: #95a5a6
    }
    .close-btn {
        margin-left: 98%
    }
    .feedback-card {
        width:1020px;
    }
</style>

