import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  Animated,
  AsyncStorage,
  Image,
  StatusBar,
  TouchableOpacity,
  Linking,
  Alert,
  Platform,
  ImageBackground,
  ScrollView,
  I18nManager,
  BackHandler
} from "react-native";
import {
  Header,
  Button,
  Container,
  List,
  ListItem,
  Content,
  Icon,
  top,
  Left,
  Right,
  Title,
  Body
} from "native-base";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Ionicons from "react-native-vector-icons/Ionicons";
// import { createAnimatableComponent ,View, Text,} from 'react-native-animatable';
import ExpanableList from "react-native-expandable-section-list";
import { CachedImage } from "react-native-cached-image";
// Styles
import styles from "./styles";
import { Metrics, Images, Fonts } from "../../../Themes/";

const profileImg =
  "https://antiqueruby.aliansoftware.net/Images/woocommerce/profileMenu.png";

export default class ControlPanel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      menuItem: [
        {
          id: 1,
          title: "Home",
          member: []
        },
        {
          id: 2,
          title: "Categories",
          member: [
            {
              title: "Mobiles & Tablets"
            },
            {
              title: "Computers & laptops"
            },
            {
              title: "Electronics"
            },
            {
              title: "Cameras"
            },
            {
              title: "Home Appliances"
            },
            {
              title: "Home & Living"
            },
            {
              title: "Health & Beauty"
            },
            {
              title: "Fashion"
            },
            {
              title: "Toy, Kids & Babies"
            },
            {
              title: "Media, Games & Music"
            }
          ]
        },
        {
          id: "3",
          title: "Brands",
          member: []
        },
        {
          id: "4",
          title: "Sale",
          member: []
        },
        {
          id: "5",
          title: "Wishlist",
          member: []
        },
        {
          id: "6",
          title: "FAQ",
          member: []
        },
        {
          id: "7",
          title: "Change Country",
          member: []
        },
        {
          id: "8",
          title: "Privacy Policy",
          member: []
        },
        {
          id: "9",
          title: "About Us",
          member: []
        },
        {
          id: "10",
          title: "LogIn",
          member: []
        }
      ]
    };
  }

  componentWillUnmount() {
    console.log("false");
    AsyncStorage.multiSet([["FirstECommerce", "false"]]);
  }

  _handleNavigation() {
    AsyncStorage.multiSet([["ArrivedFrom", "ECommerceMenu"]]);
    this.props.navigation.navigate("ECommerceCategoryProduct");
  }

  _handleBagNavigation() {
    AsyncStorage.multiSet([["ArrivedFrom", "ECommerceMenu"]]);
    this.props.navigation.navigate("ECommerceMyBag");
  }

  _handleTitleClick(title) {
    switch (title) {
      case "Home":
        this.props.navigation.navigate("ECommerceMenu");
        break;
      case "Categories":
        break;
      case "Brands":
        this.props.navigation.navigate("ECommerceBrands");
        break;
      case "Sale":
        this.props.navigation.navigate("ECommerceSale");
        break;
      case "Wishlist":
        AsyncStorage.multiSet([["ArrivedForWishList", "ECommerceMenu"]]);
        this.props.navigation.navigate("ECommerceWishList");
        break;
      case "FAQ":
        this.props.navigation.navigate("ECommerceFAQ");
        break;
      case "Change Country":
        this.props.navigation.navigate("ECommerceChangeCountry");
        break;
      case "Privacy Policy":
        this.props.navigation.navigate("ECommercePrivacyPolicy");
        break;
      case "About Us":
        this.props.navigation.navigate("ECommerceAboutUs");
        break;
      case "LogIn":
        this.props.navigation.navigate("ECommerceLogin");
        break;
    }
  }

  _handleSubTitleClick(screenName) {
    switch (screenName) {
      case "Mobiles & Tablets":
        this._handleNavigation();
        break;
      case "Computers & laptops":
        this._handleNavigation();
        break;
      case "Electronics":
        this._handleNavigation();
        break;
      case "Cameras":
        this._handleNavigation();
        break;
      case "Home Appliances":
        this._handleNavigation();
        break;
      case "Home & Living":
        this._handleNavigation();
        break;
      case "Health & Beauty":
        this._handleNavigation();
        break;
      case "Fashion":
        this._handleNavigation();
        break;
      case "Toy, Kids & Babies":
        this._handleNavigation();
        break;
      case "Media, Games & Music":
        this._handleNavigation();
        break;
    }
  }

  onSettingClick() {
    this.props.navigation.navigate("ECommerceMyAccount");
  }

  onNotificationClick() {
    this.props.navigation.navigate("ECommerceNotification");
  }

  _renderRow = (rowItem, rowId, sectionId) => (
    <TouchableOpacity
      onPress={() => this._handleSubTitleClick(rowItem.title)}
      style={styles.subTitleBg}
      key={rowId}
    >
      <Text style={styles.subTitleTxt}>{rowItem.title}</Text>
      <Ionicons
        name={I18nManager.isRTL ? "ios-arrow-back" : "ios-arrow-forward"}
        size={18}
        color="#383b4e"
        style={styles.nextArrow}
      />
    </TouchableOpacity>
  );

  _renderSection = (section, sectionId) => {
    return (
      <View>
        {section == "Categories" ? (
          <View style={styles.subTitleBg}>
            <Text style={[styles.titleTxt, { paddingLeft: 10 }]}>
              {section}
            </Text>
            <Ionicons
              name={I18nManager.isRTL ? "ios-arrow-back" : "ios-arrow-forward"}
              size={20}
              color="white"
              style={styles.nextArrow}
            />
          </View>
        ) : (
          <TouchableOpacity
            style={{ marginBottom: Metrics.WIDTH * 0.04 }}
            onPress={() => this._handleTitleClick(section)}
          >
            <Text style={styles.titleTxt}>{section}</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  _handleNotificationBack() {
    AsyncStorage.multiSet([["ArrivedForNotification", "ECommerceMenu"]]);
    this.props.navigation.navigate("ECommerceNotification");
  }

  render() {
    const { activeMenuImage } = this.state;
    StatusBar.setBarStyle("light-content", true);

    if (Platform.OS === "android") {
      StatusBar.setBackgroundColor("#0e1130", true);
      StatusBar.setTranslucent(true);
    }
    return (
      <Container>
        <View style={{ backgroundColor: "#11142a" }}>
          <View style={styles.listProfileContainer}>
            <View style={styles.profileBg}>
              <View style={styles.profileDataBg}>
                <TouchableOpacity
                  onPress={() => this._handleNotificationBack()}
                >
                  <FontAwesome name="bell" size={18} style={styles.bellIcon} />
                </TouchableOpacity>
                <View style={styles.circles}>
                  <CachedImage
                    source={{ uri: profileImg }}
                    style={styles.profileImg}
                  />
                </View>
                <TouchableOpacity onPress={this.onSettingClick.bind(this)}>
                  <Image
                    source={Images.settingsIcon}
                    style={styles.settingIcon}
                  />
                </TouchableOpacity>
              </View>
              <Text style={styles.nameTxt}>Jhon</Text>
              <Text style={styles.addressTxt}>Seattle,USA</Text>
            </View>

            <View
              style={{
                height: Metrics.HEIGHT * 0.62
              }}
            >
              <ExpanableList
                style={{
                  marginTop: Metrics.WIDTH * 0.03
                }}
                dataSource={this.state.menuItem}
                headerKey="title"
                memberKey="member"
                renderRow={this._renderRow}
                renderSectionHeaderX={this._renderSection}
                isOpen={false}
              />
            </View>
          </View>

          <View style={styles.bottomViewBg}>
            <View style={styles.bottomImageDataBg}>
              <SimpleLineIcons name="handbag" size={27} color="#fff" />
              <View style={styles.cartCountBg}>
                <Text style={styles.cartItemCount}>3</Text>
              </View>
              <TouchableOpacity onPress={() => this._handleBagNavigation()}>
                <Text
                  style={[
                    styles.bottomTxt,
                    { marginLeft: Metrics.WIDTH * 0.02 }
                  ]}
                >
                  My Bag
                </Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.bottomPriceTxt}>$150.00</Text>
          </View>
        </View>
      </Container>
    );
  }
}
