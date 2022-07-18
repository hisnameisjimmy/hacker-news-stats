const axios = require('axios');

// https://github.com/HackerNews/API
const api = 'https://hacker-news.firebaseio.com/v0/';

let top60Stories;

const numberOfStories = 60;
const topNumberOfStories = 10;

const sum = (arr) => {
  const reducer = (sum, val) => sum + val;
  const initialValue = 0;
  return arr.reduce(reducer, initialValue);
};

const topStories = async () => {
  try {
    const storyIds = await axios.get(`${api}topstories.json`);
    topStoriesArray = storyIds.data.slice(0, numberOfStories - 1);
    const storyPromises = topStoriesArray.map(async (storyId) => {
      const storyData = await axios.get(`${api}item/${storyId}.json`);
      return storyData.data.descendants;
    });
    const storyCommentsArray = await Promise.all(storyPromises);
    const filtered = storyCommentsArray.filter((item) => {
      return typeof item === 'number';
    });
    // console.log(filtered);
    const totalComments = sum(filtered);
    console.log(`\n`);
    console.log(
      `Total Comments in top ${numberOfStories} stories: ${totalComments} \n`,
    );
    const sorted = filtered.sort(function (a, b) {
      return a - b;
    });
    const topCommentedStories = sorted
      .slice(numberOfStories - topNumberOfStories - 2, numberOfStories - 1)
      .reverse();
    console.log(`Top ${topNumberOfStories} story comments counts:`);
    topCommentedStories.forEach((item, index) => {
      const number = index + 1;
      console.log(`${number}) ${item}`);
    });
  } catch (error) {
    console.log(error);
  }
};

topStories();
