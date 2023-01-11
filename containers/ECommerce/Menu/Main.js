// No es el original. Está tocado por Woopi.
// Si se necesita el original, revisar en el template.
import React, { Component } from "react";
import {
    Text,
    //ListView,
    View,
    Image,
    StatusBar,
    TouchableOpacity,
    Platform,
    ImageBackground,
    BackHandler,
    I18nManager,
    TextInput,
    AsyncStorage
} from "react-native";
import {
    Container,
    Content,
    Button,
    Icon,
    Right,
    Item,
    Input,
    Header,
    Left,
    Body,
    Title
} from "native-base";
import Ionicons from "react-native-vector-icons/Ionicons";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Fonts, Metrics, Colors, Images } from "./../Themes/";
import Swiper from "react-native-swiper";
// import { CachedImage } from "react-native-cached-image";

// Screen Styles
import styles from "./../containers/ECommerce/Menu/styles";
/**
 *  Profile Screen
 */

const rowHasChanged = (r1, r2) => r1 !== r2;
// const ds = new ListView.DataSource({ rowHasChanged });

export default class Home extends Component {
    static navigationOptions = {
        header: null,
        headerMode: 'none'
    };

    constructor(props) {
        super(props);

        const NewArrivalsOne =
            "https://antiqueruby.aliansoftware.net/Images/woocommerce/ic_new_arrivals_one.png";
        const NewArrivalsTwo =
            "https://antiqueruby.aliansoftware.net/Images/woocommerce/ic_new_arrivals_two.png";
        const NewArrivalsThree =
            "https://antiqueruby.aliansoftware.net/Images/woocommerce/ic_new_arrivals_three.png";
        const NewArrivalsFour =
            "https://antiqueruby.aliansoftware.net/Images/woocommerce/ic_new_arrivals_four.png";

        const dataObjects = [
            {
                id: 1,
                coverImage: Images.womenCategory,
                category: "Women",
                color: "rgba(138, 0, 255, 0.8)"
            },
            {
                id: 2,
                coverImage: Images.menCategory,
                category: "Men",
                color: "rgba(0, 66, 255, 0.8)"
            },
            {
                id: 3,
                coverImage: Images.kidsCategory,
                category: "Kid’s",
                color: "rgba(0, 186, 255, 0.8)"
            },
            {
                id: 4,
                coverImage: Images.accessoriesCategory,
                category: "Accessories",
                color: "rgba(255, 0, 126, 0.8)"
            }
        ];

        this.state = {
            // dataSource: ds.cloneWithRows(dataObjects),
            new_collection: [
                {
                    id: 1,
                    image: Images.homeSwiperOne,
                    title: "NEW COLLECTION",
                    description: "FOR SUMMER"
                },
                {
                    id: 2,
                    image: Images.homeSwiperTwo,
                    title: "NEW COLLECTION",
                    description: "FOR SUMMER"
                },
                {
                    id: 3,
                    image: Images.homeSwiperThree,
                    title: "NEW COLLECTION",
                    description: "FOR SUMMER"
                }
            ],
            new_arrival: [
                {
                    id: 1,
                    products: [
                        {
                            id: 1,
                            itemImage: { uri: NewArrivalsOne },
                            itemTitle: "W-Faux Leather With Quilted Sleeves",
                            itemPrice: "$30.00"
                        },
                        {
                            id: 2,
                            itemImage: { uri: NewArrivalsTwo },
                            itemTitle: "W-Quilted Men Jogger Pants",
                            itemPrice: "$50.00"
                        }
                    ]
                },
                {
                    id: 2,
                    products: [
                        {
                            id: 3,
                            itemImage: { uri: NewArrivalsThree },
                            itemTitle: "W-Faux Leather With Quilted Sleeves",
                            itemPrice: "$40.00"
                        },
                        {
                            id: 4,
                            itemImage: { uri: NewArrivalsFour },
                            itemTitle: "W-Quilted Men Jogger Pants",
                            itemPrice: "$70.00"
                        }
                    ]
                },
                {
                    id: 3,
                    products: [
                        {
                            id: 1,
                            itemImage: { uri: NewArrivalsOne },
                            itemTitle: "W-Faux Leather With Quilted Sleeves",
                            itemPrice: "$30.00"
                        },
                        {
                            id: 2,
                            itemImage: { uri: NewArrivalsTwo },
                            itemTitle: "W-Quilted Men Jogger Pants",
                            itemPrice: "$50.00"
                        }
                    ]
                }
            ]
        };
    }

    componentWillMount() {
        var that = this;
        BackHandler.addEventListener("hardwareBackPress", this.backPressed);

        AsyncStorage.multiGet(["FirstECommerce"]).then(data => {
            if (data[0][1] == "") {
                FirstAttempt = "false";
            } else {
                FirstAttempt = data[0][1];
            }
            console.log(FirstAttempt);
            if (FirstAttempt == "true") {
                setTimeout(() => {
                    this.props.navigation.openDrawer();
                }, 1000);
            }
        });
    }

    backPressed = () => {
        this.props.navigation.navigate("FirstScreen");
        return true;
    };

    componentWillUnmount() {
        BackHandler.removeEventListener("hardwareBackPress", this.backPressed);
        console.log("false");
        AsyncStorage.multiSet([["FirstECommerce", "false"]]);
    }

    _handleProductDetailClick() {
        this.props.navigation.navigate("ECommerceProductDetails", {
            screenName: "ECommerceMenu"
        });
    }

    _handleProductPage() {
        AsyncStorage.multiSet([["ArrivedFrom", "ECommerceMain"]]);
        this.props.navigation.navigate("ECommerceCategoryProduct");

        // this.props.navigation.navigate("ECommerceCategoryProduct",{},
        // {
        //   type: "Navigation/NAVIGATE",
        //   routeName: "ECommerceCategoryProduct",
        //   params: {name: "ECommerceMenu"}
        // })
    }

    _renderRow(rowData) {
        return (
            <TouchableOpacity onPress={() => this._handleProductPage()}>
                <ImageBackground
                    source={rowData.coverImage}
                    style={styles.coverImageStyle}
                >
                    <View
                        style={[styles.categoryBtn, { backgroundColor: rowData.color }]}
                    >
                        <Text style={styles.buttonText}>{rowData.category}</Text>
                    </View>
                </ImageBackground>
            </TouchableOpacity>
        );
    }

    render() {
        const { new_collection, new_arrival } = this.state;

        StatusBar.setBarStyle("light-content", true);
        if (Platform.OS === "android") {
            StatusBar.setBackgroundColor("#0e1130", true);
            StatusBar.setTranslucent(true);
        }

        var rightButton = (
            <Button transparent onPress={this._handleBack}>
                <Icon
                    name="ios-create-outline"
                    style={{ color: "#fff", fontSize: 30 }}
                    onPress={this.functionRedirect}
                />
            </Button>
        );

        return (
            <Container>
                <Header style={styles.header} androidStatusBarColor={"#0e1130"}>
                    <Left style={styles.left}>
                        <TouchableOpacity
                            style={styles.backArrow}
                            onPress={() => this.props.navigation.openDrawer()}
                        >
                            <Icon name="ios-menu" style={styles.iconColor} />
                        </TouchableOpacity>
                    </Left>

                    <Body style={styles.body}>
                    <Image
                        source={Images.drawer_antiquruby_logo}
                        style={{ flex: 0.6, resizeMode: "contain" }}
                    />
                    </Body>

                    <Right style={styles.right}>
                        <TouchableOpacity
                            onPress={() => this.props.navigation.navigate("FirstScreen")}
                            style={styles.backArrow}
                        >
                            {I18nManager.isRTL ? (
                                <Ionicons
                                    name="ios-arrow-round-forward"
                                    size={30}
                                    color="#fff"
                                />
                            ) : (
                                <Ionicons name="ios-arrow-round-back" size={30} color="#fff" />
                            )}
                        </TouchableOpacity>
                    </Right>
                </Header>
                <Content>
                    <View style={styles.searchViewBg}>
                        <View style={styles.searchView}>
                            <Ionicons
                                name="ios-search"
                                size={20}
                                color="#8e8e93"
                                style={{ marginLeft: 10 }}
                            />
                            <Input
                                style={styles.searchInput}
                                placeholder="Search"
                                placeholderTextColor="#8e8e93"
                                underlineColorAndroid="transparent"
                                autoCapitalize="none"
                                keyboardType="default"
                                selectionColor="#6d6d71"
                            />
                            {/*<Text style={styles.searchText}>Search</Text>*/}
                        </View>
                    </View>

                    <View style={styles.slidesec}>
                        <Swiper
                            showsButtons={false}
                            autoplay={true}
                            autoplayTimeout={2.5}
                            activeDot={<View style={styles.activeDot} />}
                            dot={<View style={styles.dot} />}
                        >
                            {new_collection.map((item, index) => {
                                return (
                                    <View style={styles.slide} key={index}>
                                        <Image source={item.image} style={styles.sliderImage} />
                                        <View style={styles.contentStyle}>
                                            <Text style={styles.headertext}>{item.title}</Text>
                                            <Text style={styles.desctext}>{item.description}</Text>
                                        </View>
                                    </View>
                                );
                            })}
                        </Swiper>
                    </View>

                    {/*<ListView
                        contentContainerStyle={styles.listContent}
                        dataSource={this.state.dataSource}
                        renderRow={this._renderRow.bind(this)}
                        enableEmptySections
                    />*/}

                    <View style={styles.newArrivalSec}>
                        <Left style={styles.sideButtons}>
                            <MaterialCommunityIcons
                                name="chevron-left"
                                size={26}
                                color="#cccccc"
                                onPress={() => this.refs.swiper.scrollBy(-1)}
                            />
                        </Left>
                        <Body style={styles.newArrivalBody}>
                        <Text style={styles.titelText}>NEW ARRIVALS</Text>
                        </Body>
                        <Right style={styles.sideButtons}>
                            <MaterialCommunityIcons
                                name="chevron-right"
                                size={26}
                                color="#cccccc"
                                onPress={() => this.refs.swiper.scrollBy(1)}
                            />
                        </Right>
                    </View>

                    <Swiper
                        style={styles.swiperView}
                        ref="swiper"
                        loop={true}
                        showsButtons={false}
                        autoplayTimeout={2.5}
                        activeDot={<View />}
                        dot={<View />}
                    >
                        {new_arrival.map((item, index) => {
                            return (
                                <View key={index} style={styles.newArrivalView}>
                                    {item.products.map((item, index) => {
                                        return (
                                            <View key={index}>
                                                <TouchableOpacity
                                                    style={styles.rowMain}
                                                    onPress={() => this._handleProductDetailClick()}
                                                >
                                                    {/*<CachedImage
                                                        source={item.itemImage}
                                                        style={styles.itemImage}
                                                    />*/}
                                                    <Text style={styles.itemTitle} numberOfLines={2}>
                                                        {item.itemTitle}
                                                    </Text>
                                                    <Text style={styles.itemPrice}>{item.itemPrice}</Text>
                                                </TouchableOpacity>
                                            </View>
                                        );
                                    })}
                                </View>
                            );
                        })}
                    </Swiper>
                </Content>
            </Container>
        );
    }
}
