import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import NewsCard from './NewsCard';

export default function NewsList({ posts, loading }) {
    
      if (loading) {
        return <Text> Loading posts...</Text>
      }

      const calculateScore = (post) => {
        const likeCount = post.likeCount.length * 5;
        const createdAt = new Date(post.createdAt);
    
        const ageInHours = (Date.now() - createdAt) / (1000 * 60 * 60);
        const recency = Math.max(50 - ageInHours, 0) * 3;
    
        return likeCount + recency;
      }

      const sortedPosts = posts.slice().sort((a, b) => calculateScore(b) - calculateScore(a));

  return (
    <ScrollView>
        {sortedPosts.map((item) => (
            <NewsCard 
            key={item._id} 
            title={item.title} 
            image={item.image} 
            likes={item.likeCount} 
            content={item.content} 
            postId={item._id}
            author={item.author._id}
          />
        ))}
    </ScrollView>
  )
}

const styles = StyleSheet.create({})