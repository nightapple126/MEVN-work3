<template>
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
        <FormItem label="Name" prop="name">
            <Input v-model="formValidate.name" placeholder="Enter your name"></Input>
        </FormItem>
        <FormItem>
            <Button type="primary" @click="handleSubmit('formValidate')">Submit</Button>
            <Button type="ghost" @click="handleReset('formValidate')" style="margin-left: 8px">Reset</Button>
        </FormItem>
    </Form>
</template>
<script>
import Service from "@/services/Service";
export default {
  data() {
    return {
      formValidate: {
        name: ""
      },
      ruleValidate: {
        name: [
          {
            required: true,
            message: "The label cannot be empty",
            trigger: "blur"
          }
        ]
      },
      loadingStatus: false,
      headers: { Authorization: "Bearer " + this.$store.state.token },
      name: ''
    }
  },
  methods: {
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          Service.put(this.formValidate, this.name);
          this.$Message.success("Service modified!");
          this.$router.push({ name: "allService" });
        } else {
          this.$Message.error("Fail!");
        }
      });
    },
    handleReset(name) {
      this.$refs[name].resetFields();
    }
  },
  async created() {
            try{
                this.name = this.$store.state.route.params.name
                console.log(this.name)
                this.formValidate =(await Service.getOne(this.name)).data[0]
                console.log(this.formValidate);
            } catch(e) {
                console.log(e)
            }   
        }
};
</script>
