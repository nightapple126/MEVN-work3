<template>
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
        <FormItem label="Label" prop="label">
            <Input v-model="formValidate.label" placeholder="Enter your name"></Input>
        </FormItem>
        <FormItem label="Price" prop="price">
            <Input v-model="formValidate.price" placeholder="Price .."></Input>
        </FormItem>
        <FormItem label="Origin" prop="origin">
           <Input v-model="formValidate.origin" placeholder="Origin .."></Input>
        </FormItem>
       <FormItem label="Taste" prop="taste">
            <RadioGroup v-model="formValidate.taste">
                <Radio label="sweet">Sweet</Radio>
                <Radio label="sour">Sour</Radio>
                <Radio label="salty">Salty</Radio>
                <Radio label="bitter">Bitter</Radio>
                <Radio label="pungent">Pungent</Radio>
                <Radio label="astringent">Astringent</Radio>
            </RadioGroup>
        </FormItem>
        <FormItem label="Basic ingredient">
            <Input v-model="formValidate.basic_ingredient" placeholder="Basic ingredients .."></Input>
        </FormItem>
        <FormItem label="Is halal ?" prop="isHalal">
            <RadioGroup v-model="formValidate.isHalal">
                <Radio label=true>Halal</Radio>
                <Radio label=false>Not halal</Radio>
            </RadioGroup>
        </FormItem>
        <div>
        <Upload
            :before-upload="handleUpload"
            action="http://localhost:3000/staff/restaurant/upload"
            name="plate_photo"
            :headers="headers"
            >
            <Button type="ghost" icon="ios-cloud-upload-outline">Upload plate photo</Button>
        </Upload>
        <div v-if="file !== null">Upload file: {{ file.name }} <Button type="text" @click="upload" :loading="loadingStatus">{{ loadingStatus ? 'Uploading' : 'Click to upload' }}</Button></div>
        </div>
        <FormItem>
            <Button type="primary" @click="handleSubmit('formValidate')">Submit</Button>
            <Button type="ghost" @click="handleReset('formValidate')" style="margin-left: 8px">Reset</Button>
        </FormItem>
    </Form>
</template>
<script>
    import Food from '@/services/Food';
    export default {
        data () {
            return {
                formValidate: {
                    label: '',
                    price: '',
                    origin: '',
                    taste: '',
                    basic_ingredient: [],
                    is_halal: false,
                    plate_photo: ''
                },
                ruleValidate: {
                    label: [
                        { required: true, message: 'The label cannot be empty', trigger: 'blur' }
                    ],
                    price: [
                        { required: true, message: 'Price cannot be empty', trigger: 'blur' }
                    ],
                    origin: [
                        { required: true, message: 'Please insert the origin of the plate', trigger: 'change' }
                    ],
                    taste: [
                        { required: true, message: 'Please select taste', trigger: 'change' }
                    ],
                    basic_ingredient: [
                        { required: true, message: 'Ingredients field cannot be empty', trigger: 'blur' }
                    ],
                    isHalal: [
                        { required: true, message: 'is it halal ?', trigger: 'change' }
                    ],
                    plate_photo: [
                        { required: true, type: 'file', message: 'Please upload plate photo', trigger: 'blur' }
                    ]
                },
                file: null,
                loadingStatus: false,
                headers: { Authorization: 'Bearer ' + this.$store.state.token },
                basic_ingredient: ''
            }
        },
        methods: {
            handleSubmit (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        if(this.formValidate.plate_photo) {
                            Food.post(this.formValidate)
                            this.$Message.success('plate added!')
                            this.$router.push({ name:'/staff/restaurant/plate/all' })
                        }
                    } else {
                        this.$Message.error('Fail!');
                    }
                })
            },
            handleReset (name) {
                this.$refs[name].resetFields();
            },
            handleUpload (file) {
                this.file = file;
                return false;
            },
            async upload () {
                try {
                    this.loadingStatus = true
                    let formData = new FormData()
                    formData.append('plate_photo', this.file)
                    const data = (await Food.upload(formData)).data
                    this.formValidate.plate_photo = data.filename
                    setTimeout(() => {
                        this.file = null;
                        this.loadingStatus = false;
                        this.$Message.success('Success')
                    }, 1500);
                }catch(e) {
                    console.log(e);
                }
            }
        }
    }
</script>
