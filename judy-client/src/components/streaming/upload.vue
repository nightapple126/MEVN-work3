<template>
    <div style="width:640px;display:flex;flex-direction:column;align-items:left;">
        <h2 style="padding:15px;">Upload Movies</h2>
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
         <FormItem label="Title" prop="title">
            <Input v-model="formValidate.title" placeholder="Movie Title"></Input>
        </FormItem>
       <FormItem label="Synopsis" prop="synopsis">
            <Input v-model="formValidate.synopsis" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="Enter something..."></Input>
        </FormItem>
        
         <FormItem>
                 <Upload
            :before-upload="handleUpload"
            action="http://localhost:3000/staff/movie/upload">
            <Button type="ghost" icon="ios-film-outline">Select the file to upload</Button>
        </Upload>
        <div v-if="file !== null">Upload file: {{ file.name }} <Button type="text" @click="upload" :loading="loadingStatus">{{ loadingStatus ? 'Uploading' : 'Click to upload' }}</Button></div>

        </FormItem>   
        <FormItem>
            <Button type="primary" @click="handleSubmit('formValidate')">Submit</Button>
            <Button type="ghost" @click="handleReset('formValidate')" style="margin-left: 8px">Reset</Button>
        </FormItem>
        </Form>

          </div>
</template>
<script>
 import Movie from '@/services/Movie';
    export default {
               data () {
            return {
                image: null,
                 file: null,                
                 loadingStatus: false,
                  headers: { Authorization: 'Bearer ' + this.$store.state.token },
                formValidate: {
                    title: '',
                    synopsis: '',
                   // image:'',
                    video:''
                },
                ruleValidate: {
                    title: [
                        { required: true, message: 'The title cannot be empty', trigger: 'blur' }
                    ],
                    desc: [
                        { required: true, message: 'Please enter synopsis', trigger: 'blur' },
                        { type: 'string', min: 20, message: 'Introduce no less than 20 words', trigger: 'blur' }
                    ]
                }
            }
        },
        methods: {
            handleUpload (file) {
                this.file = file;
                console.log(file)
                return false;
            },
             handleImageUpload (image) {
                this.image = image;
                console.log(this.image);
                return false;
            },
              handleSubmit (title) {
                this.$refs[title].validate((valid) => {
                    if (valid) {
                        this.$Message.success('Success!');
                    } else {
                        this.$Message.error('Fail!');
                    }
                })
            },
            handleReset (title) {
                this.$refs[title].resetFields();
            },
             async upload () {
             try {
                    this.loadingStatus = true
                    let formData = new FormData()
                    formData.append('video', this.file)
                    const data = (await Movie.upload(formData)).data
                    this.formValidate.video = data.filename
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