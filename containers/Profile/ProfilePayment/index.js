
import React, { Component } from 'react';
import { Text, View, Image, StatusBar, Platform, TouchableOpacity,  BackHandler, I18nManager} from 'react-native';
import { Container,  Icon, Right,   Header,   Left, Body, Title, Content, Form,List, ListItem} from 'native-base';
import Swiper from 'react-native-swiper';
// Screen Styles
import styles from './styles';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
const profileImage = 'https://antiqueruby.aliansoftware.net//Images/profile/user_image_p4.png';

export default class ProfilePayment extends Component {

  constructor(props) {
 		super(props);
 		this.state = {
      isMessageActive: true,
      isFollowed: false,
    };
 	}
  componentWillMount() {
    var that = this
    BackHandler.addEventListener('hardwareBackPress', function() {
      // that.props.navigation.navigate('Home')
        that.props.navigation.navigate('Profile')
        return true;
    });
  }
  render(){
		StatusBar.setBarStyle('light-content', true);
		if(Platform.OS === 'android') {
			StatusBar.setBackgroundColor('transparent',true);
			StatusBar.setTranslucent(true);
		}

    return(
     <Container style={{backgroundColor: '#2d324f'}}>
       <View style={styles.logosec}>
         <Header
           androidStatusBarColor={'#2d324f'}
           style={styles.header}>

           {/* Take up the space */}
           <Left style={styles.left}>
             <TouchableOpacity style={styles.backArrow} onPress={()=>this.props.navigation.navigate('Profile')}>
              <Icon name={I18nManager.isRTL ? "ios-arrow-forward" : "ios-arrow-back"} style={{ color: '#fff' }}/>
             </TouchableOpacity>
           </Left>

           {/* Title */}
           <Body style={styles.body}>
             <Title style={styles.headerTitle}>
               Profiles
             </Title>
           </Body>

           {/* Right Icon */}
           <Right style={styles.right}>
             <TouchableOpacity onPress={()=>alert("Edit")}>
               <Text style={styles.edit}>Edit</Text>
             </TouchableOpacity>
           </Right>
         </Header>
       </View>
       <Content style={styles.slidesec}>
         <View style={styles.profileHeaderMain}>
            <View style={styles.profileImageSec}>

              <TouchableOpacity style={(this.state.isMessageActive) ? styles.activeButton : styles.normalButton} onPress={()=>this.setState({isMessageActive: !this.state.isMessageActive})}>
                <EvilIcons name="comment" size={30} color="white"/>
              </TouchableOpacity>

              <Image source={{uri:profileImage}} style={styles.profileImage}/>

              <TouchableOpacity style={(this.state.isFollowed) ? styles.activeButton : styles.normalButton} onPress={()=>this.setState({isFollowed: !this.state.isFollowed})}>
                <SimpleLineIcons name="user-follow" size={20} color="white" style={{transform: [{scaleX: I18nManager.isRTL ? -1 : 1}]}}/>
              </TouchableOpacity>

            </View>
            <Text style={styles.name}>Johnie Cornwall</Text>
         </View>


         <List style={styles.details}>

           <ListItem style={styles.listItem} onPress={()=>alert("Account")}>
             <View>
               <Text style={styles.listItemText}>Account</Text>
             </View>
             <View style={styles.listRight}>
               <Text style={styles.listRightEmail}>johnie_cornwall@gmail.com</Text>
               <TouchableOpacity>
               {
                 (I18nManager.isRTL)
                 ?
                     <Icon name="ios-arrow-back" style={styles.arrowForword}/>
                 :
                     <Icon name="ios-arrow-forward" style={styles.arrowForword}/>
               }
               </TouchableOpacity>
             </View>
           </ListItem>

           <ListItem style={styles.listItem} onPress={()=>alert("Change Password")}>
             <View>
               <Text style={styles.listItemText}>Change Password</Text>
             </View>
             <View style={styles.listRight}>
               <TouchableOpacity>
               {
                 (I18nManager.isRTL)
                 ?
                     <Icon name="ios-arrow-back" style={styles.arrowForword}/>
                 :
                     <Icon name="ios-arrow-forward" style={styles.arrowForword}/>
               }
               </TouchableOpacity>
             </View>
           </ListItem>

           <ListItem style={styles.listItem} onPress={()=>alert("Payment")}>
             <View>
               <Text style={styles.listItemText}>Payment</Text>
             </View>
             <View style={styles.listRight}>
               <TouchableOpacity>
               {
                 (I18nManager.isRTL)
                 ?
                     <Icon name="ios-arrow-back" style={styles.arrowForword}/>
                 :
                     <Icon name="ios-arrow-forward" style={styles.arrowForword}/>
               }
               </TouchableOpacity>
             </View>
           </ListItem>

           <ListItem style={styles.listItem} onPress={()=>alert("Terms of Service")}>
             <View>
               <Text style={styles.listItemText}>Terms of Service</Text>
             </View>
             <View style={styles.listRight}>
               <TouchableOpacity>
               {
                 (I18nManager.isRTL)
                 ?
                     <Icon name="ios-arrow-back" style={styles.arrowForword}/>
                 :
                     <Icon name="ios-arrow-forward" style={styles.arrowForword}/>
               }
               </TouchableOpacity>
             </View>
           </ListItem>

           <ListItem style={styles.listItem} onPress={()=>alert("Support")}>
             <View>
               <Text style={styles.listItemText}>Support</Text>
             </View>
             <View style={styles.listRight}>
               <TouchableOpacity>
               {
                 (I18nManager.isRTL)
                 ?
                     <Icon name="ios-arrow-back" style={styles.arrowForword}/>
                 :
                     <Icon name="ios-arrow-forward" style={styles.arrowForword}/>
               }
               </TouchableOpacity>
             </View>
           </ListItem>

           <ListItem style={styles.listFooter} onPress={()=>alert("Logout")}>
             <Text style={styles.listFooterText}>Logout</Text>
           </ListItem>

         </List>
       </Content>
    </Container>

    );
  }
}
