import RSS from "rss";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

export default function generateRssFeed(targetDir = "./public") {
  const site_url = "https://sergionavarro.me";

  const feedOptions = {
    title: "SergioNavarro.me",
    description: "Software engineer empowered by AI",
    site_url: site_url,
    feed_url: `${site_url}/rss.xml`,
    image_url: `${site_url}/logo.png`,
    pubDate: new Date(),
    copyright: `All rights reserved ${new Date().getFullYear()}, Your Name`,
  };

  const feed = new RSS(feedOptions);

  fs.mkdirSync(targetDir, { recursive: true });
  fs.writeFileSync(path.join(targetDir, "rss.xml"), feed.xml({ indent: true }));
}

const isDirectRun =
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isDirectRun) {
  generateRssFeed(process.argv[2] || "./public");
}
