import { ScrollView, StyleSheet, Image, TouchableOpacity, Text } from 'react-native'
import React from 'react'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { useRouter } from 'expo-router'

export default function NewsToday({ posts, loading }) {
  const router = useRouter()

  if (loading) {
    return <Text>Loading posts...</Text>
  }

  // Sort the posts by createdAt in descending order and limit to 5 posts
  const sortedPosts = posts
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5)

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.container}>
      {sortedPosts.map((item, index) => (
        <TouchableOpacity 
          key={index}
          style={styles.imageContainer}
          onPress={() => router.push({
            pathname: '/newsDetails',
            params: {
              title: item.title,
              image: item.image,
              likes: item.likeCount,
              content: item.content,
              postId: item._id
            }
          })}
        >
          <Image source={{ uri: item.image }} style={styles.image} />
        </TouchableOpacity>
      ))}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    marginVertical: hp(1.5), // Responsive vertical margin
    paddingHorizontal: wp(2.5), // Responsive horizontal padding
  },
  imageContainer: {
    marginRight: wp(2.5),
    borderRadius: wp(3),
    overflow: 'hidden',
  },
  image: {
    width: wp(55), // Responsive width
    height: hp(20), // Responsive height
    borderRadius: wp(3),
  },
})
