import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import NewsCard from './NewsCard';

export default function NewsList({ posts, loading }) {
    
      if (loading) {
        return <Text> Loading posts...</Text>
      }

      

  return (
    <ScrollView>
        {posts.map((item) => (
            <NewsCard 
            key={item._id} 
            title={item.title} 
            image={item.image} 
            likes={item.likeCount} 
            content={item.content} 
            postId={item._id}
          />
        ))}
    </ScrollView>
  )
}

const styles = StyleSheet.create({})