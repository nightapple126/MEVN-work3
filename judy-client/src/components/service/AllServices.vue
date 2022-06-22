<template>
    <div>
        <Button class="btn-add-service" type="primary">Add Service</Button>
        <Table border :columns="serviceDataCol" :data="serviceData"></Table>
    </div>
</template>
<script>
    import Service from '@/services/Service'
    export default {
        data () {
            return {
                serviceDataCol: [
                    {
                        title: 'Name',
                        key: 'name',
                        render: (h, params) => {
                            return h('div', [
                                h('strong', params.row.name)
                            ]);
                        }
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
                                            this.editPlatRedirect(params.row)
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
                                           this.deletePlate(params.row.name)
                                           this.remove(params.index)
                                           //console.log(params)
                                        }
                                    }
                                }, 'Delete')
                            ]);
                        }
                    }
                ],
                serviceData: []
            }
        },
        methods: {
            show (index) {
                this.$Modal.info({
                    title: 'User Info',
                    content: `Name：${this.data6[index].name}<br>Age：${this.data6[index].age}<br>Address：${this.data6[index].address}`
                })
            },
            remove (index) {
                this.serviceData.splice(index, 1);
            },
            async deletePlate(id) {
                await Service.delete(id)
                this.$Message.success('Service deleted');
            },
            editPlatRedirect(name) {
                // console.log(this.$store.state.route);
                this.$router.push({name: 'editService', params: { name: name.name }})
            }
        },
        async mounted() {
            console.log('hello there')
            this.serviceData = (await Service.get()).data
            console.log(this.serviceData[0].name)
        }
    }
</script>

<style scoped>
    div {
        display: flex;
        flex-direction: column;
        margin: 0 2em 0 2em
    }
    .btn-add-service {
        margin-bottom: 2em;
        align-self: flex-end
    }
</style>

