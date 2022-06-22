<template>
      <div class="layout">
        <Layout>
            <Sider ref="side1" hide-trigger collapsible :collapsed-width="78" v-model="isCollapsed">
                <Menu v-if="!isStaff" active-name="1-2" theme="dark" width="auto" :class="menuitemClasses">
                    <MenuItem @click.native="goTo('/guest/restaurant/plate')" name="1"> 
                      <Icon type="pizza"></Icon>
                      Food
                    </MenuItem>
                    <MenuItem @click.native="goTo('/guest/video/all')" name="3"> 
                      <Icon type="film-marker"></Icon>
                      Movies
                    </MenuItem>
                    <MenuItem @click.native="goTo('/guest/event')" name="9"> 
                      <Icon type="calendar"></Icon>
                      Events
                    </MenuItem>
                    <MenuItem @click.native="goTo('/guest/chat')" name="6"> 
                      <Icon type="chatboxes"></Icon>
                      Chat
                    </MenuItem>
                    <MenuItem @click.native="goTo('/bot')" name="4"> 
                      <Icon type="chatboxes"></Icon>
                      Bot
                    </MenuItem>
                </Menu>
                <Menu v-if="isStaff" active-name="1-2" theme="dark" width="auto" :class="menuitemClasses">
                    <Submenu name="1">
                        <template slot="title">
                            <Icon type="pizza"></Icon>
                            Restaurant
                        </template>
                        <MenuItem name="1-1" @click.native="goTo('/staff/restaurant/plate/all')" >View plates</MenuItem>
                        <MenuItem name="1-2" @click.native="goTo('/staff/restaurant/plate')">Add plate</MenuItem>
                    </Submenu>

                    <Submenu name="3">
                        <template slot="title">
                            <Icon type="calendar"></Icon>
                            Events
                        </template>
                        <MenuItem name="3-1" @click.native="goTo('/staff/event/all')">View events</MenuItem>
                        <MenuItem name="3-2" @click.native="goTo('/staff/event')">Add an event</MenuItem>
                    </Submenu>
                    <Submenu name="4">
                        <template slot="title">
                            <Icon type="person-stalker"></Icon>
                            Guests
                        </template>
                        <MenuItem name="4-1" @click.native="goTo('/staff/guests/checkin')">Check in</MenuItem>
                    </Submenu>
                    <MenuItem name="5" @click.native="goTo('/bot/stats')">
                        <Icon type="chatboxes"></Icon>
                        <span>Chatbot</span>
                    </MenuItem>
                </Menu>
            </Sider>
         
            <Layout>
                <Header :style="{padding: 0}" class="layout-header-bar">
                  <Row type="flex" justify="start" class="code-row-bg">
                    <Col span="6">
                    <Icon @click.native="collapsedSider" :class="rotateIcon" :style="{margin: '20px 20px 0'}" type="navicon-round" size="24"></Icon>
                    </Col>
                    <Col span="3" offset="15">
                      <div v-if="user==null">
                           <a href="/login">Login</a>
                      </div>
                      <div v-else>
                           <Dropdown>
                        <a href="javascript:void(0)">
                            Welcome, {{user.username}}
                            <Icon type="arrow-down-b"></Icon>
                        </a>
                        <DropdownMenu slot="list">
                            <DropdownItem><router-link to="/profile">Profile</router-link></DropdownItem>
                            <DropdownItem @click.native="lock">Lock account</DropdownItem>
                            <DropdownItem @click.native="logout">Logout </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                      </div>
                      
                    </Col>
                  </Row>
                    
                </Header>
                <Content :style="{margin: '20px', background: '#fff', height: '100%'}">
                  <Question></Question>
                    <slot>
                        no content here!
                    </slot>
                </Content>
            </Layout>
        </Layout>
    </div>
</template>

<script>
import router from '../router';
import Question from './question/Question';
export default {
   components: {
     Question
  },
  name: "DevapesBase",
  data() {
    return {
      isCollapsed: false,
      questionExist: false
    };
  },
  computed: {
    rotateIcon() {
      return ["menu-icon", this.isCollapsed ? "rotate-icon" : ""];
    },
    menuitemClasses() {
      return ["menu-item", this.isCollapsed ? "collapsed-menu" : ""];
    },
    user() {
      return this.$store.state.user;
    },
    isStaff(){
      if (this.$store.state.user==null || this.$store.state.user===undefined)
        return false;
      return this.$store.state.user.role=="STAFF";
    }
  },
  methods: {
    collapsedSider() {
      this.$refs.side1.toggleCollapse();
    },
    lock() {
      console.log("Locking");
      this.$store.commit("toggleLock",true);
    },
    logout(){
        this.$store.dispatch("logout");
        router.push("/login");
    },
    goTo(destination){
        router.push(destination);
    }
  }
};
</script>

<style scoped>
.ivu-layout.ivu-layout-has-sider {
  height: 100% !important;
  min-height: 100% !important;
}
.ivu-layout-sider {
  transition: all 0.2s ease-in-out;
  position: relative;
  background: #2b2b2b;
  min-width: 0;
  overflow: hidden;
}
.ivu-layout-container {
  height: 100% !important;
  min-height: 100% !important;
}
.ivu-menu-dark {
  background: #2b2b2b;
}
.collapsed-menu {
  margin-top: 197% !important;
}
.collapsed-menu i {
  font-size: 39px !important;
}
.ivu-menu {
  margin-top: 97%;
}
.layout {
  border: 1px solid #d7dde4;
  background: #f5f7f9;
  position: relative;
  border-radius: 4px;
  overflow: hidden;
  height: 100% !important
  
}
.layout-header-bar {
  background: #fff;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
}
.layout-logo-left {
  width: 90%;
  height: 30px;
  background: #5b6270;
  border-radius: 3px;
  margin: 15px auto;
}
.menu-icon {
  transition: all 0.3s;
}
.rotate-icon {
  transform: rotate(-90deg);
}
.menu-item span {
  display: inline-block;
  overflow: hidden;
  width: 69px;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: bottom;
  transition: width 0.2s ease 0.2s;
}
.menu-item i {
  transform: translateX(0px);
  transition: font-size 0.2s ease, transform 0.2s ease;
  vertical-align: middle;
  font-size: 16px;
}
.collapsed-menu span {
  width: 0px;
  transition: width 0.2s ease;
}
.collapsed-menu i {
  transform: translateX(5px);
  transition: font-size 0.2s ease 0.2s, transform 0.2s ease 0.2s;
  vertical-align: middle;
  font-size: 22px;
}
</style>