import { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native'

import Title from '../components/UI/Title';
import NumberContainer from '../components/game/NumberContainer';
import PrimaryButton from '../components/UI/PrimaryButton';

const generateRandomBetween = (min, max, exclude) => {
    const randomNumber = Math.floor(Math.random() * (max - min)) + min;

    if (randomNumber === exclude) {
        return generateRandomBetween(min, max, exclude)
    } else {
        return randomNumber
    }
}

let minBoundary = 1;
let maxBoundary = 100;

const GameScreen = ({ userNumber }) => {
    const initialGuess = generateRandomBetween(minBoundary, maxBoundary, userNumber);
    const [currentGuess, setCurrentGuess] = useState(initialGuess)

    const nextGuessHandler = (direction) => { //? direction => 'lower' or 'greater'
        if ((direction === 'lower' && currentGuess < userNumber) || (direction === 'higher' && currentGuess > userNumber)) {
            Alert.alert("Don't lie!, 'You know that this is wrong...", [{ text: "Sorry!", style: "cancel" }])
            return;
        }

        if (direction === 'lower') {
            maxBoundary = currentGuess;
        } else {
            minBoundary = currentGuess + 1
        }
        console.log(minBoundary, maxBoundary, userNumber, '<<<');
        const newRandomNumber = generateRandomBetween(minBoundary, maxBoundary, currentGuess)

        setCurrentGuess(newRandomNumber)
    }

    return (
        <View style={styles.screen}>
            <Title>Opponent's Guess</Title>
            <NumberContainer>{currentGuess}</NumberContainer>
            <View style={styles.bodyContainer}>
                <Text>Higher or Lower ?</Text>
                <View style={styles.buttonsContainer} >
                    <PrimaryButton onPress={nextGuessHandler.bind(this, 'lower')}>
                        -
                    </PrimaryButton>
                    <PrimaryButton onPress={nextGuessHandler.bind(this, 'higher')}>
                        +
                    </PrimaryButton>
                </View>
            </View>

            {/* <View>LOG ROUNDS</View> */}
        </View>
    )
}

export default GameScreen;

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        padding: 24,
    },

    bodyContainer: {
        justifyContent: "center",
        alignItems: "center"
    },

    buttonsContainer: {
        flexDirection: 'row'
    }

})