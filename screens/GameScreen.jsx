import { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, Text, FlatList } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

import Title from '../components/UI/Title';
import NumberContainer from '../components/game/NumberContainer';
import PrimaryButton from '../components/UI/PrimaryButton';
import Card from '../components/UI/Card';
import InstructionText from '../components/UI/InstructionText';
import GuessLogItem from '../components/game/GuessLogItem';

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

const GameScreen = ({ userNumber, onGameOver }) => {
    const initialGuess = generateRandomBetween(1, 100, userNumber);
    const [currentGuess, setCurrentGuess] = useState(initialGuess)
    const [guessRounds, setGuessRounds] = useState([initialGuess])

    //* if there is update, run this useEffect
    useEffect(() => {
        if (currentGuess === userNumber) {
            onGameOver(guessRounds.length)
        }
    }, [currentGuess, userNumber, onGameOver])

    //* Reset min and max boundary
    useEffect(() => {
        minBoundary = 1
        maxBoundary = 100
    }, [])

    const nextGuessHandler = (direction) => { //? direction => 'lower' or 'greater'

        //! VALIDATION CHECK FOR WRONG DIRECTION
        if ((direction === 'lower' && currentGuess < userNumber) || (direction === 'higher' && currentGuess > userNumber)) {
            // console.log('wrong');
            Alert.alert(
                "Don't lie!",
                "You know that this is wrong...",
                [{ text: "Sorry!", style: "cancel" }])
            return;
        }

        if (direction === 'lower') {
            maxBoundary = currentGuess;
        } else {
            minBoundary = currentGuess + 1
        }

        const newRandomNumber = generateRandomBetween(minBoundary, maxBoundary, currentGuess)

        setCurrentGuess(newRandomNumber)
        setGuessRounds(prevGuessRounds => [newRandomNumber, ...prevGuessRounds,])
    }

    const guessRoundsListLength = guessRounds.length

    return (
        <View style={styles.screen}>
            <Title>Opponent's Guess</Title>
            <NumberContainer>{currentGuess}</NumberContainer>
            <Card>
                <InstructionText style={styles.instructionText}>Higher or Lower ?</InstructionText>
                <View style={styles.buttonsContainer} >
                    <View style={styles.buttonContainer}>
                        <PrimaryButton onPress={nextGuessHandler.bind(this, 'lower')}>
                            <Ionicons name="md-remove" size={24} color="white" />
                        </PrimaryButton>
                    </View>
                    <View style={styles.buttonContainer}>
                        <PrimaryButton onPress={nextGuessHandler.bind(this, 'higher')}>
                            <Ionicons name="md-add" size={24} color="white" />
                        </PrimaryButton>
                    </View>
                </View>
            </Card>

            <View style={styles.listContainer}>
                {/*
                    guessRounds.map(guessRound => <Text key={guessRound}>{guessRound}</Text>)
    */}
                <FlatList
                    data={guessRounds}
                    renderItem={(itemData) => <GuessLogItem roundNumber={guessRoundsListLength - itemData.index} guess={itemData.item} />}
                    keyExtractor={(item) => item}
                />
            </View>
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
    },

    buttonContainer: {
        flex: 1,
    },

    instructionText: {
        marginBottom: 15,
    },

    listContainer: {
        flex: 1,
        padding: 16,
    }

})