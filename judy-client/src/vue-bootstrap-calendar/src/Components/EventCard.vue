<template>
    <div class="panel no-margin" :class="[event.color]" @click="showEventDetails">
         <Modal
                v-model="modal1"
                title="Delete event"
				@on-ok="ok"
        		@on-cancel="cancel"
                ok-text="Delete"
                cancel-text="Cancel"
                >
        <p>Are you sure you want to delete this event ?</p>
        </Modal>
        <div class="panel-heading event-title" :class="{'clickable-event':isDaySelected}">{{event.title}}</div>
    </div>
</template>

<script>
    export default {
        data(){
            return {
                modal1 : false
            }
        },
        props: {
            event: {
                type: Object
            },
            isDaySelected: {
                type: Boolean
            }
        },
        methods: {
            ok(){
                this.$store.commit("removeEvent",this.event);
            },
            cancel(){

            },
            showEventDetails() {
                if(this.isDaySelected){
                    this.modal1=true;
                }
            }
        }
    }
</script>
<style>
    .event-title {
        padding: 0px 5px;
        font-size: 12px
    }
    .clickable-event {
        text-decoration: underline;
    }
</style>