<template>
    <div class="day-cell"
         :class="{'today' : day.isToday, 'current-month' : day.isCurrentMonth, 'weekend': day.isWeekEnd, 'selected-day':isDaySelected}"
        @click="showDayOptions">
        <Modal
                v-model="modal1"
                title="Add a new event"
				@on-ok="ok"
        		@on-cancel="cancel"
                ok-text="Submit"
                cancel-text="Cancel"
                >
                 <Form :model="formItem" :label-width="80">
                    <FormItem label="Event title">
                        <Input v-model="formItem.title" placeholder="Enter title..."></Input>
                       
                    </FormItem>
                     <FormItem label="Importance">
                        <Button type="success" @click.native="setColor('panel-success')">Low</Button>
                        <Button type="warning" @click.native="setColor('panel-warning')">Medium</Button>
                        <Button type="error" @click.native="setColor('panel-danger')">High</Button>
                    </FormItem>
                 </Form>
            </Modal>
        <div class="row">
            <div class="col-sm-6">
                <div v-show="isDaySelected">
                    <span class="label label-success" @click="showAddEventForm"> {{ $t('generic.add_event') }}</span>
                </div>
            </div>
            <div class="col-sm-6">
                <p class="day-number">{{ day.date.format('D') }}</p>
            </div>
        </div>
        <div class="event-box">
            <event-card
                    :event="event"
                    :key="event.id"
                    :day-date="day.date"
                    :is-day-selected="isDaySelected"
                    v-for="event in day.events">
            </event-card>
        </div>
    </div>
</template>
<script>
import moment from "moment";
import { DAY_SELECTED, CHANGE_MONTH } from "../actions";
export default {
  data() {
    return {
      isDaySelected: false,
      modal1: false,
      formItem: {
        title: ""
      },
      color: "panel-success"
    };
  },
  components: {
    EventCard: require("./EventCard.vue").default
      ? require("./EventCard.vue").default
      : require("./EventCard.vue")
  },
  props: {
    day: {
      type: Object
    },
    firstDay: {
      type: String
    }
  },
  created() {
    let me = this;
    this.$root.$on(DAY_SELECTED, function(payload) {
      if (payload.dayDate != me.day.date) {
        me.isDaySelected = false;
      }
    });

    this.$root.$on(CHANGE_MONTH, function() {
      me.isDaySelected = false;
    });
  },
  methods: {
    setColor(color){
        this.color=color;
    },
    ok() {
        let event= {
          title: this.formItem.title,
          color: this.color,
          date: this.day.date.toDate()
        };
        this.$store.commit("addEvent",event);
    },
    cancel() {},
    showDayOptions() {
      let me = this;
      let startOfToday = moment().startOf("day");
      if (
        this.day.date.isAfter(startOfToday) ||
        this.day.date.isSame(startOfToday)
      ) {
        this.isDaySelected = true;
        this.$root.$emit(DAY_SELECTED, { dayDate: me.day.date });
      }
    },
    showAddEventForm() {
      this.modal1 = true;
    }
  }
};
</script>
<style>
.day-cell {
  flex: 1;
  min-height: 112px;
  padding: 4px;
  border-right: 1px solid #e0e0e0;
  border-bottom: 1px solid #e0e0e0;
  background: rgba(147, 147, 147, 0.1);
}

.day-number {
  text-align: right;
  color: rgba(0, 0, 0, 0.25);
  font-size: 1em;
  padding: 5px;
}

.current-month {
  background: #fff;
}

.current-month p {
  color: rgba(0, 0, 0, 0.5);
  font-size: 1.5em;
}

.selected-day p {
  font-size: 2.4em;
  font-weight: bolder;
}

.weekend p {
  color: rgba(210, 2, 2, 0.6);
}

.today {
  background-color: #e8fde7;
}

.today p {
  font-size: 2em;
  font-weight: bolder;
  color: #367016;
}
</style>