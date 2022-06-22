<template>
    <Modal v-if="question!==undefined"
        v-model="modal6"
        title= "Give your view about this statement"
        :loading="loading"
        @on-ok="done">
        <div style="text-align:center">
            <p v-if="question.content !== undefined" class="parag">{{question.content}}</p>
                <Spin v-if="question.content === undefined" size="large"></Spin>
            <div class="rate-step">
                <div class="rate" @click="showForm(5)">
                    <img src="@/assets/img/rating/5.png" alt="rate 5">
                    <span>Stronly Agree</span>
                </div>
                <div class="rate" @click="showForm(4)">
                    <img src="@/assets/img/rating/4.png" alt="rate 4">
                    <span>Agree</span>
                </div>
                
                <div class="rate" @click="showForm(3)">
                    <img src="@/assets/img/rating/3.png" alt="rate 3">
                    <span>Neutral</span>
                </div>
                <div class="rate" @click="showForm(2)">
                    <img src="@/assets/img/rating/2.png" alt="rate 2">
                    <span>Disagree

                    </span>
                </div>
                <div class="rate" @click="showForm(1)">
                    <img src="@/assets/img/rating/1.png" alt="rate 1">
                    <span>Strongly Disagree</span>
                </div>
            </div>
            
        </div>
    </Modal>
</template>
<script>
import QuestionService from '@/services/Question'
export default {
  name: 'Question',
  props: [],
  data() {
      return {
          modal6: false,
          loading: true,
          question: {content:""},
          closeCard: false,
          question_respond:{
              rate: undefined,
              question_id: undefined
          },
          show: false,
      }
  },async beforeCreate(){
            console.log("Before Create");
            let questions = await (QuestionService.GetQuestions());
            
            let index = Math.floor(Math.random()* questions.data.length);
            if(questions.data.length !== 0){
                  this.question = questions.data[index];
                  this.modal6= false;
                  console.log(questions);
            } else{

            }
          
          //  this.question_respond.question_id = this.question._id;
     },
  methods: {
      asyncOK () {
                setTimeout(() => {
                    this.modal6 = false;
                }, 2000);
            },
      showForm(rate) {
        this.question_respond.rate= rate;
        console.log(rate+' is your rate')
        this.$Message.success('One more step to go :)')
      },
      async done() {
          try {
              if(typeof this.question_respond.rate === undefined || this.question_respond.rate === null){
                    this.$Message.error('Please Answer');
              }else {
              this.question_respond.question_id = this.question._id;
              console.log(JSON.stringify(this.question_respond));
              QuestionService.respondToQuestion(this.question_respond);
              setTimeout(() => {
                    this.modal6 = false;
                    this.$Message.success(' Thank you for your patience ! ')
                }, 2000);
              }

            //  this.question_respond.question_id = 
            /*  Feedback.post(this.feedback)
              this.$Message.success('Thank you! We realy appreciate your help <3')
              this.$store.dispatch('setFeedback', JSON.stringify(this.question))
              this.close()*/
          }catch(e) {
              /*this.$Message.error('Oops! Something went wrong :(')*/
              console.log("no no guys")
          }
          
      },
      cancel() {
          this.$Message.error('Answer more question to help me feel you more often.')
      },
      close() {
          this.closeCard = true
      }
  },
  async mounted() {
       
      var that = this;
      setTimeout(() => {
        if (that.question===undefined){
            return;
        }
        if ( typeof that.question !== undefined && that.question.content.length !== 0){
                that.modal6 = true;
                console.log(that.question.content.length)
          }
        else {
            that.modal6 = false;
        }
      }, 5000);
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
        color: #95a5a6;
        font-size: 25px;
    }
    .close-btn {
        margin-left: 98%
    }
    .feedback-card {
        width:1020px;
    }
</style>


