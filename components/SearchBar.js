import { StyleSheet, Text, TextInput, View } from 'react-native'
import React from 'react'
import { Ionicons } from "@expo/vector-icons"
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen'

export default function SearchBar({ searchQuery, setSearchQuery }) {
  return (
    <View style={styles.container}>
      <Ionicons name='search' size={20} color="#888" />
      <TextInput
         value={searchQuery}
         onChangeText={setSearchQuery}
         placeholder='Search by title, content, or category...'
         style={styles.input}
         selectionColor="#333"
      />
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#dedede",
        padding: hp(1.2),
        paddingHorizontal: hp(1.8),
        borderRadius: hp(2.8),
        marginHorizontal: hp(3),
        fontSize: hp(1)
    },
    input: {
        marginLeft: hp(1),
        flex: 1
    }
})