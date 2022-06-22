<template>
  <div>
      <Table class="data-table" border :columns="eventColumn" :data="events"></Table>
  </div>
</template>
<script>
import Event from "@/services/Event";
export default {
  name:'AllEventStaff',
  data() {
      return {
          eventColumn: [
                    {
                        title: 'Title',
                        key: 'title',
                        render: (h, params) => {
                            return h('div', [
                                h('Icon', {
                                    props: {
                                        type: ''
                                    }
                                }),
                                h('strong', params.row.title)
                            ]);
                        }
                    },
                    {
                        title: 'Type',
                        key: 'type'
                    },
                    {
                        title: 'Start date',
                        key: 'start_date'
                    },
                    {
                        title: 'Finish date',
                        key: 'finish_date'
                    },
                    {
                        title: 'Audience number',
                        key: 'audience_number'
                    },
                    {
                        title: 'Organizer',
                        key: 'organizer'
                    },
                    {
                        title: 'Sponsors',
                        key: 'sponsors'
                    },
                    {
                        title: 'Action',
                        key: 'action',
                        width: 150,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.edit(params.row._id)
                                        }
                                    }
                                }, 'Edit'),
                                h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.remove(params.row._id)
                                        }
                                    }
                                }, 'Delete')
                            ]);
                        }
                    }
                ],
                events: []
      }
  },
  methods: {
      async remove(id) {
          try {
              await Event.delete(id)
          } catch (error) {
              console.log(error)
          }
      },
      edit(id) {
          this.$router.push({ name: 'EditEvent', params: { id: id } })
      }
  },
  async mounted() {
      try {
          this.events = (await Event.getAllForStaff()).data.events
      } catch (error) {
          console.log(error)
      }
  }
}
</script>
<style scoped>
.data-table {
    margin: 3%
}
</style>


