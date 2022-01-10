import React, { useState, useEffect } from 'react';
import { REACT_APP_IPSERVER } from '@env';
//Store
import { connect } from 'react-redux';
import { View, ScrollView, KeyboardAvoidingView } from 'react-native';
import { HeaderBar } from '../components/Header'
import  CompanyCard  from '../components/CompanyCard'
import { Button, ButtonText } from "../components/Buttons";
import { Input, AirbnbRating, Rating } from 'react-native-elements';


const LeaveRatingsScreen = (props) => {

    const [ rate, setRate ] = useState(0);
    const [ feedback, setFeedback ] = useState("");
    const [ company, setCompany ] = useState(null);

    // useEffect d'initialisation de la page Company :
    useEffect(() => {
        console.log(props.route && props.route.params && props.route.params.companyId);
        let companyId = props.route && props.route.params && props.route.params.companyId;
        // fonction chargement des infos de la compagnie loggée :
        async function loadDataCie() {
            // appel route put pour modifier données company :
            var rawDataCie = await fetch(`http://${REACT_APP_IPSERVER}/companies/${companyId}/${props.user.token}`); // (`adresseIPserveur/route appelée/req.params?req.query`)
            var dataCie = await rawDataCie.json();
// console.log("dataCie", dataCie.company);
            if (dataCie.result) {
                setCompany(dataCie.company); // set état company avec toutes data
            }
        }
        loadDataCie();
        }, []);

    const sendRating = async () => {
// console.log("dans fonction sendRating");
        const saveRate = await fetch(`http://${REACT_APP_IPSERVER}/ratings/${props.user.token}`, { 
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: 
                `feedback=${feedback}&
                rating=${rate}&
                dateRating=${new Date()}&
                clientId=${props.user.companyId}&
                providerId=${company._id}&
                userId=${props.user._id}`
        })
        var dataRate = await saveRate.json()
// console.log("dataRate", dataRate);
        props.navigation.navigate("Rating");
        setFeedback(dataRate.newRatingSaved.feedback)
// console.log("dataRate.newRatingSaved.feedback", dataRate.newRatingSaved.feedback);
// console.log("dans fonction sendRating BIS");
};

    if (company) {

    return (
    
    <View style={{flex:1}}>

        <HeaderBar
            onBackPress={() => props.navigation.goBack()}
            leftComponent
            title="Votre avis"
            navigation={props.navigation}
            user={props.user}
        >
        </HeaderBar>

            <ScrollView showsVerticalScrollIndicator={false} style={{backgroundColor:"white"}}>

                <KeyboardAvoidingView 
                    behavior="position" 
                    // contentContainerStyle={{alignItems: "center", paddingLeft:20, paddingRight: 20}}
                >

                    <View style={{flex:1, paddingBottom:80, backgroundColor:"white"}}>
                        <View style={{ top:10, paddingLeft:15, paddingRight: 15}}>
                            <CompanyCard
                                navigation={props.navigation}
                                dataCompany={company}
                            />
                        </View>

                        <View style={{top:40, paddingLeft:15, paddingRight: 15}}>
                            <Input
                                value={feedback}
                                label={`Décrivez votre expérience avec ${company.companyName}`}
                                placeholder='En quelques mots'
                                onChangeText={(value) => setFeedback(value)}
                            />
                        </View>

                        <View style={{height:50, justifyContent:"center", top:50, paddingLeft:15, paddingRight: 15}}>
                            <AirbnbRating
                                type="custom"
                                selectedColor="#F47805"
                                unSelectedColor="#F4780533"
                                reviewColor="#F47805"
                                defaultRating={0}
                                count={5}
                                size={30}
                                showRating={false}
                                onFinishRating={(rating) => setRate(rating)}
                            />
                        </View>

                        <View style={{top:50, paddingHorizontal:15, paddingVertical:20, alignItems:"center"}}>
                            <View style={{paddingBottom:10}}>
                                <Button 
                                    title="Poster l'avis"
                                    size="md"
                                    color="primary"
                                    onPress={() => sendRating()}
                                >
                                </Button>
                            </View>
                            <ButtonText 
                                title="Annuler" 
                                onPress={() => props.navigation.goBack()}
                            >
                            </ButtonText>
                        </View>

                    </View>

                </KeyboardAvoidingView>

            </ScrollView>

    </View>

    )

    } else {
        return null
    }

};

// on récupère le user stocké dans le store : 
function mapStateToProps(state) {
  return { user: state.user }
};

export default connect(mapStateToProps, null)(LeaveRatingsScreen);


