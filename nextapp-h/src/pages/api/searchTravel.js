export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { startDate, endDate, keywords, location } = req.query;

    // Example real articles (this should be replaced by actual database logic in production)
    const articles = [
      { id: 1, title: "Event 1", excerpt: "This is a fake blog post about technology.", image: "a.jpg", date: new Date(2025, 0, 15), time: "01-11-2024 - 10-11-2024", location: "24200 Dana Point Harbor, Dana Point, CA" },
      { id: 2, title: "Event 2", excerpt: "This post discusses the future of web development.", image: "a.jpg", date: new Date(2025, 1, 5), time: "01-11-2024 - 10-11-2024",location: "new york" },
      { id: 3, title: "Event 3", excerpt: "This article dives into the world of artificial intelligence.", image: "a.jpg", date: new Date(2025, 1, 10),time: "01-11-2024 - 10-11-2024", location: "24200 Dana Point Harbor, Dana Point, CA" },
      { id: 4, title: "Event 4", excerpt: "This article dives into the world of artificial intelligence.", image: "a.jpg", date: new Date(2025, 1, 15),time: "01-11-2024 - 10-11-2024", location: "LA" },
      { id: 5, title: "Event 5", excerpt: "This article dives into the world of artificial intelligence.", image: "a.jpg", date: new Date(2025, 1, 20),time: "01-11-2024 - 10-11-2024", location: "24200 Dana Point Harbor, Dana Point, CA" },
    ];

    // Parse the startDate and endDate if provided
    const parsedStartDate = startDate ? new Date(startDate) : null;
    const parsedEndDate = endDate ? new Date(endDate) : null;

    // If no filters are applied, return all articles
    const filteredArticles = articles.filter(article => {
      // Date Range Filter
      const articleDate = article.date;
      const matchesDateRange = parsedStartDate && parsedEndDate
        ? articleDate >= parsedStartDate && articleDate <= parsedEndDate
        : true;

      // Keyword Filter
      const matchesKeyword = keywords
        ? article.title.toLowerCase().includes(keywords.toLowerCase()) ||
          article.excerpt.toLowerCase().includes(keywords.toLowerCase())
        : true;

      // Location Filter
      const matchesLocation = location
        ? article.location.toLowerCase().includes(location.toLowerCase())
        : true;

      return matchesDateRange && matchesKeyword && matchesLocation;
    });

    // Return filtered articles
    res.status(200).json(filteredArticles);
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
