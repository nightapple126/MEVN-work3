<template>
    <Table border :columns="palteDataCol" :data="palteData"></Table>
</template>
<script>
    import Food from '@/services/Food'
    export default {
        data () {
            return {
                palteDataCol: [
                    {
                        title: 'Label',
                        key: 'label',
                        render: (h, params) => {
                            return h('div', [
                                h('Icon', {
                                    props: {
                                        type: 'pizza'
                                    }
                                }),
                                h('strong', params.row.label)
                            ]);
                        }
                    },
                    {
                        title: 'Price',
                        key: 'price'
                    },
                    {
                        title: 'Taste',
                        key: 'taste'
                    },
                    {
                        title: 'Origin',
                        key: 'origin'
                    },
                    {
                        title: 'Halal',
                        key: 'is_halal'
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
                                            this.editPlatRedirect(params.row._id)
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
                                           this.deletePlate(params.row._id)
                                           this.remove(params.index)
                                           //console.log(params)
                                        }
                                    }
                                }, 'Delete')
                            ]);
                        }
                    }
                ],
                palteData: []
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
                this.palteData.splice(index, 1);
            },
            async deletePlate(id) {
                await Food.delete(id)
                this.$Message.success('Plate deleted');
            },
            editPlatRedirect(id) {
                // console.log(this.$store.state.route);
                this.$router.push({name: 'editPlate', params: { id: id }})
            }
        },
        async mounted() {
            console.log('hello there')
            this.palteData = (await Food.get()).data.plates
            console.log(this.palteData)
        }
    }
</script>

<style scoped>

</style>

