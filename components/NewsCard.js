import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Link } from "expo-router";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen'

export default function NewsCard({ title, image, likes, content, postId, author }) {

  return (
    <Link href={{ pathname: "/newsDetails", params: { title, image, likes, content, postId, author } }} asChild>
      <TouchableOpacity style={styles.card}>
        <Image source={{ uri: image }} style={styles.image} />
        <View style={styles.info}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.likes}>{likes} Likes</Text>
        </View>
      </TouchableOpacity>
    </Link>
  );
}


const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        backgroundColor: 'white',
        padding: hp(1.5),
        borderRadius: hp(1.8),
        marginVertical: hp(0.6),
        marginHorizontal: hp(2),
        shadowColor: '#000',
        shadowOpacity: 1,
        shadowOffset: { width: 0, height: 2 },
        elevation: 0.2,
      },
      image: {
        width: hp(11),
        height: hp(11),
        borderRadius: hp(1),
      },
      info: {
        marginLeft: hp(2),
        justifyContent: 'center',
      },
      title: {
        fontWeight: 'bold',
        fontSize: 14,
        marginBottom: 5,
      },
      reads: {
        color: '#888',
        fontSize: 12,
      },
})