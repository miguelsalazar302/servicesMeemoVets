import React, { Component } from 'react';
import {Text, TextInput, View, Image, StatusBar, Platform, TouchableOpacity, BackHandler, I18nManager, Alert} from 'react-native';
import { Container,  Icon, Right,   Header,   Left, Body, Title, Spinner, Content, List, ListItem} from 'native-base';
// Screen Styles
import styles from './../containers/Profile/ProfilePayment/styles';

import DatePicker from 'react-native-date-picker';
import Helpers from "../modules/Helpers";
import APIService from "../modules/ApiService";

const from = new Date();
const to = new Date();

from.setHours(8);
from.setMinutes(0);

to.setHours(22);
to.setMinutes(0);

const timezone = -(new Date().getTimezoneOffset());

export default class AgendaVet extends Component {

    static navigationOptions =
        ({ navigation }) => (
            {
                headerLeft: <Icon name="arrow-back"
                                  size={30} color='#ffffff'
                                  style={{paddingLeft: 20, color: "#fff"}}
                                  onPress={ () => { navigation.goBack() }} />,
                title: navigation.getParam('type') === 'normal' ? 'Horarios de Atención' : 'Horarios de Atención Extendido',
                headerTitleStyle: {
                    alignSelf: 'center',
                    textAlign: 'center'
                },
            });

    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            showDatePicker: false,
            currentEditionIndex: '',
            currentEditionIndexTarget: '',
            datePickerLinkText: 'Cerrar',
            agenda: [
                {
	                from: '',
	                to: '',
                    day_number: 1, // Lunes
                    dayName: 'Lu', //
                    enabled: false
                },
                {
                    from: '',
                    to: '',
                    day_number: 2, // Martes
                    dayName: 'Ma', //
                    enabled: false
                },
                {
                    from: '',
                    to: '',
                    day_number: 3, // Miércoles
                    dayName: 'Mi', //
                    enabled: false
                },
                {
                    from: '',
                    to: '',
                    day_number: 4, // Jueves
                    dayName: 'Ju', //
                    enabled: false
                },{
                    from: '',
                    to: '',
                    day_number: 5, // Viernes
                    dayName: 'Vi', //
                    enabled: false
                },{
                    from: '',
                    to: '',
                    day_number: 6, // Sábado
                    dayName: 'Sá', //
                    enabled: false
                }, {
                    from: '',
                    to: '',
                    day_number: 0, // Domingo
                    dayName: 'Do', //
                    enabled: false
                },
            ]
        };

        this.helpers = new Helpers();
        this.api = new APIService();
    }

    componentWillMount() {
        const that = this;
        BackHandler.addEventListener('hardwareBackPress', () => {
            that.props.navigation.navigate('Configuration');
            return true;
        });
    }

    componentDidMount() {
        const defaultValue = undefined;
        const type = this.props.navigation.getParam('type', defaultValue);
        const scheduleId = this.props.navigation.getParam('scheduleId', defaultValue);
        // const scheduleId = 1; // TODO: REMOVE DEBUG
        console.log('ENABLED:', this.props.navigation.getParam('enabled'));
        const enabled = this.props.navigation.getParam('enabled', true);


        this.setState({
            type,
            scheduleId,
            enabled
        });

        if(scheduleId) {
            this.setState({
                loading: true
            });
            this.api.getScheduleById(scheduleId).then(res => {
                console.log(res);
                if(res.data && res.data.agenda && res.data.agenda.length) {
                    this.parseAgendaAndSetInitialState(res.data.agenda);
                } else {
                    this.setState({
                        loading: false
                    });
                }
            }).catch(err => {
                console.log(err);
            });
        }
    }

    parseAgendaAndSetInitialState(agenda) {
        console.log(agenda);
        const actualAgenda = JSON.parse(JSON.stringify(this.state.agenda));
        agenda.map(item => {
            actualAgenda.map(actualItem => {
                if(actualItem.day_number === Number(item.day_number)) {
                    actualItem.enabled = true;
                    actualItem.from = this.parseAPIResponseToDateFormat(item.from);
                    actualItem.to = this.parseAPIResponseToDateFormat(item.to);
                }
                return actualItem;
            })
        });

        // UPDATE VIEW
        this.setState({
            agenda: actualAgenda,
            loading: false
        });
    }

    parseAPIResponseToDateFormat(stringHour /* For i.e.: 08:00:00 */) {
        const date = new Date();
        const hour = Number(stringHour.split(':')[0]);
        date.setHours(hour);

        const minutes = Number(stringHour.split(':')[1]);
        date.setMinutes(minutes);

        return date;
    }

    copyDatesFromEarlierDay(index) {
        const agenda = this.state.agenda;

        if(index !== 0) {
            const prevIndex = agenda[index - 1];
            console.log(prevIndex);
            if(prevIndex.from) {
                agenda[index].from = prevIndex.from;
            }
            if(prevIndex.to) {
                agenda[index].to = prevIndex.to;
            }
            this.setState({
                agenda
            })
        }
    }

    toggleDay(index) {
        let agenda = this.state.agenda;
        agenda[index].enabled = !agenda[index].enabled;


        if(agenda[index].enabled) {
            agenda[index].from = from;
            agenda[index].to = to;
            this.copyDatesFromEarlierDay(index);

        } else {
            agenda[index].from = '';
            agenda[index].to = '';
        }

        this.setState({
            agenda
        });
    }

    setTime(index, target) {
        this.setState({
            datePickerLinkText: 'Cerrar',
            showDatePicker: !this.state.showDatePicker,
            currentEditionIndex : index,
            currentEditionIndexTarget : target // 'from' || 'to'
        });
    }

    closeDatePicker() {
        this.setState({
            showDatePicker: !this.state.showDatePicker,
        });
    }

    setCurrentIndexDate(date) {
        const agenda = this.state.agenda;
        if(this.state.currentEditionIndexTarget === 'from') {
            if(date.getTime() > agenda[this.state.currentEditionIndex].to.getTime()){
                return;
            }
        }
        if(this.state.currentEditionIndexTarget === 'to') {
            if(date.getTime() < agenda[this.state.currentEditionIndex].from.getTime()){
                return;
            }
        }

        if(date.getTime() === agenda[this.state.currentEditionIndex].from.getTime()
        || date.getTime() === agenda[this.state.currentEditionIndex].to.getTime() ) {
            return;
        }
        agenda[this.state.currentEditionIndex][this.state.currentEditionIndexTarget] = date;
        this.setState({
            datePickerLinkText: 'Seleccionar',
            agenda
        });
    }

    convertAgendaDatesToISOString(agenda) {
        let clonedAgenda = JSON.parse(JSON.stringify(agenda));
        clonedAgenda = clonedAgenda.map(item => {
            if(item.to) {
               item.to = new Date(item.to).toISOString();
            }
            if(item.from) {
               item.from = new Date(item.from).toISOString();
            }
            return item;
        });
        return clonedAgenda;
    }

    convertAgendaDatesToAPITimezone(agenda) {
        let clonedAgenda = JSON.parse(JSON.stringify(agenda));
        clonedAgenda = clonedAgenda.map(item => {
            if(item.to) {
                const tz = new Date(item.to).getTimezoneOffset();
                item.to = new Date(item.to);
                item.to = item.to.setMinutes(item.to.getMinutes() - tz);

            }
            if(item.from) {
                const tz2 = new Date(item.from).getTimezoneOffset();
                item.from = new Date(item.from);
                item.from = item.from.setMinutes(item.from.getMinutes() - tz2);
            }
            return item;
        });
        return clonedAgenda;
    }

    convertAgendaDatesToAPIHours(agenda) {
        let clonedAgenda = JSON.parse(JSON.stringify(agenda));
        clonedAgenda = clonedAgenda.map(item => {
            if(item.to) {
                item.to = item.to.split('T')[1].split('.')[0].split(':')[0]
                    + ':'
                    + item.to.split('T')[1].split('.')[0].split(':')[1]
            }
            if(item.from) {
                item.from = item.from.split('T')[1].split('.')[0].split(':')[0]
                    + ':'
                    + item.from.split('T')[1].split('.')[0].split(':')[1]
            }
            return item;
        });
        return clonedAgenda;
    }

    filterAgendaDisabledDates(agenda) {
        return agenda.filter(item => item.enabled);
    }

    parseAgendaAndGoToMapStep() {
        const clonedAgenda = [];
        this.state.agenda.forEach((item) => {
            clonedAgenda.push(item);
        });

        let parsedAgenda = this.filterAgendaDisabledDates(clonedAgenda);
        parsedAgenda = this.convertAgendaDatesToAPITimezone(parsedAgenda);
        parsedAgenda = this.convertAgendaDatesToISOString(parsedAgenda);
        parsedAgenda = this.convertAgendaDatesToAPIHours(parsedAgenda);

        if(!parsedAgenda.length) {
            Alert.alert('Error', 'Debe agregar al menos un día y un horario.');
            return;
        }

        this.props.navigation.navigate('MapZoneVet', {
            type: this.state.type,
            scheduleId: this.state.scheduleId,
            agenda: parsedAgenda,
            enabled: this.state.enabled
        });
    }

    render(){
        StatusBar.setBarStyle('light-content', true);
        if(Platform.OS === 'android') {
            StatusBar.setBackgroundColor('transparent',true);
            StatusBar.setTranslucent(true);
        }

        const agenda = this.state.agenda;
        let minimumDate;
        let maximumDate;
        if(this.state.currentEditionIndexTarget === 'from') {
            maximumDate = agenda[this.state.currentEditionIndex].to;
        }
        if(this.state.currentEditionIndexTarget === 'to') {
            minimumDate = agenda[this.state.currentEditionIndex].from;
        }

        return(
            this.state.loading ? <Spinner/> :
                <Container style={{backgroundColor: '#2d324f'}}>
                    <Content style={styles.slidesec}>

                        <List style={this.state.showDatePicker ? styles.detailsDisabled : styles.details}>

                            { this.state.agenda.map((day, index) => {
                                return (
                                    <ListItem key={index} style={styles.listItem}>
                                        <TouchableOpacity disabled={this.state.showDatePicker} onPress={()=> this.toggleDay(index)}>
                                            <View style={
                                                this.state.agenda[index].enabled
                                                    ? styles.dayOfTheWeekBadgeEnabled : styles.dayOfTheWeekBadge
                                            }>
                                                <Text style={styles.dayOfTheWeekBadgeText}>{day.dayName}</Text>
                                            </View>
                                        </TouchableOpacity>
                                        <View style={styles.listRight}>
                                            <TouchableOpacity disabled={this.state.showDatePicker || !this.state.agenda[index].enabled}
                                                              onPress={()=> this.setTime(index, 'from')}>
                                                <Text style={
                                                    this.state.agenda[index].enabled
                                                     ? styles.listRightTextInputEnabled
                                                     : styles.listRightTextInput
                                                }>
                                                    {
                                                        this.state.agenda[index].from ?
                                                        this.helpers.parseEventTime(this.state.agenda[index].from, false, false)
                                                            : ''
                                                    }
                                                </Text>
                                            </TouchableOpacity>
                                            <Text style={styles.listItemText}>-</Text>
                                            <Text style={styles.listItemText}> </Text>
                                            <Text style={styles.listItemText}> </Text>
                                            <Text style={styles.listItemText}> </Text>
                                            <Text style={styles.listItemText}> </Text>
                                            {/* TODO quitar || !this.state.agenda[index].enabled para
                                            probar https://github.com/master-atul/react-native-exception-handler*/}
                                            <TouchableOpacity disabled={this.state.showDatePicker || !this.state.agenda[index].enabled}
                                                              onPress={()=> this.setTime(index, 'to')}>
                                                <Text style={
                                                    this.state.agenda[index].enabled
                                                        ? styles.listRightTextInputEnabled
                                                        : styles.listRightTextInput
                                                }>
                                                    {
                                                        this.state.agenda[index].to ?
                                                        this.helpers.parseEventTime(this.state.agenda[index].to, false, false)
                                                            : ''
                                                    }
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    </ListItem>
                                    )
                            })}

                        </List>

                        {this.state.showDatePicker ?
                            <View>
                                <DatePicker
                                    style={styles.datePicker}
                                    fadeToColor={'#ccc'}
                                    date={this.state.agenda[this.state.currentEditionIndex][this.state.currentEditionIndexTarget]}
                                    mode="time"
                                    minimumDate={minimumDate}
                                    maximumDate={maximumDate}
                                    minuteInterval={15}
                                    timeZoneOffsetInMinutes={timezone}
                                    onDateChange={date => {
                                        this.setCurrentIndexDate(date);
                                    }}
                                />
                                <TouchableOpacity onPress={()=> this.closeDatePicker()}>
                                    <Text style={styles.datePickerLink}>{this.state.datePickerLinkText}</Text>
                                </TouchableOpacity>
                            </View>
                            :
                            <TouchableOpacity style = {this.state.agenda.length ? styles.buttonSignIn : styles.buttonSignInDisabled}
                                              disabled = {!this.state.agenda.length}
                                              onPress = {() => this.parseAgendaAndGoToMapStep()}>
                                <Text style = {styles.signInText}>Continuar</Text>
                            </TouchableOpacity>
                        }

                    </Content>
                </Container>
        );
    }
}
