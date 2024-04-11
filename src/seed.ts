const mongoose = require('mongoose')
import { CategorySchema } from "./category/category.schema";
import { NewsSchema } from "./news/news.schema";
import { UserSchema } from "./user/user.schema";
import { FeedbackSchema } from "./feedback/feedback.schema";
import { SubscriptionSchema } from "./subscription/subscription.schema";
const keys = require("./config/keys")

const Category = mongoose.model("Category", CategorySchema);
const News = mongoose.model("News", NewsSchema);
const User = mongoose.model("User", UserSchema);
const Feedback = mongoose.model("Feedback", FeedbackSchema);
const Subscription = mongoose.model("Subscription", SubscriptionSchema)

mongoose.connect(keys.mongoURI)
  .then(() => console.log('MongoDB connected.'))
  .catch(error => console.log(error))

const categoriesData = [
  { name: 'Категорія 1', description: 'Опис категорії 1' },
  { name: 'Категорія 2', description: 'Опис категорії 2' },
  { name: 'Категорія 3', description: 'Опис категорії 3' },
  { name: 'Категорія 4', description: 'Опис категорії 4' },
  { name: 'Категорія 5', description: 'Опис категорії 5' },
]

const seedCategories = async () => {
  await User.deleteMany({});
  await Feedback.deleteMany({});
  await Subscription.deleteMany({});
  await Category.deleteMany({});
  const categories = []

  for (const categoryData of categoriesData) {
    const category = new Category(categoryData)
    await category.save()
    categories.push(category)
  }

  console.log('Categories seeded')
  return categories
}

const seedNews = async (categories) => {
  await News.deleteMany({});

  for (const [index, category] of categories.entries()) {
    for (let i = 0; i < 3; i++) {
      const newsIndex = index * 3 + i + 1
      const newsItem = {
        name: `Новина ${newsIndex}`,
        description: `Опис новини ${newsIndex}`,
        articles: [
          {
            title: `Стаття 1 новини ${newsIndex}`,
            news: `Контент статті 1 новини ${newsIndex}`,
          },
          {
            title: `Стаття 2 новини ${newsIndex}`,
            news: `Контент статті 2 новини ${newsIndex}`,
          },
        ],
        category: category._id.toString(),
        user: null,
      }

      await new News(newsItem).save()
    }
  }

  console.log('News seeded')
}

const seedDB = async () => {
  const categories = await seedCategories()
  await seedNews(categories)
  mongoose.disconnect()
}

seedDB()