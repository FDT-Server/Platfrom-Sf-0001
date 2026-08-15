import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

export const revalidate = 300; // Cache the response for 5 minutes (300 seconds)

export async function GET() {
  try {
    // Fetch the live HTML, also telling Next.js fetch cache to revalidate every 5 mins
    const response = await fetch('https://events.studentforge.in/', {
      next: { revalidate: 300 }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch events: ${response.statusText}`);
    }
    
    const html = await response.text();
    const $ = cheerio.load(html);
    const events: any[] = [];

    // The events are in the main grid container. We find all .group elements inside it.
    $('.grid.grid-cols-1 > .group').each((i: any, el: any) => {
      const element = $(el);
      
      const imageUrl = element.find('img').attr('src') || '';
      const title = element.find('h4').text().trim() || 'Untitled Event';
      
      // The first span in this block usually contains the ID
      const id = element.find('.flex.items-center.gap-2\\.5.flex-wrap > span').first().text().trim() || `scraped-event-${i}`;
      
      // The last span in that block contains the date (e.g., "Sun, 9 Aug")
      let dateText = element.find('.flex.items-center.gap-2\\.5.flex-wrap > span:last-child').text().trim();
      
      // Cheerio might include SVG text if not careful, so clean it up if it has extra spaces
      dateText = dateText.replace(/\\n/g, '').trim();

      // Venue
      const venue = element.find('.flex.items-center.gap-1\\.5.text-xs.sm\\:text-sm.text-neutral-400.font-normal.truncate.mt-1 span.truncate').text().trim() || "Virtual / Campus";
      
      // Price
      const price = element.find('.flex.items-baseline.gap-1\\.5 .text-sm.sm\\:text-base.font-bold.text-white').text().trim() || "Free";
      
      events.push({
        id,
        title,
        date: dateText,
        time: '', // Time isn't isolated in the snippet
        location: venue,
        price,
        imageUrl,
        category: "All", 
        description: `Join us for ${title}!`, 
        tags: ["Event", "StudentForge"]
      });
    });

    return NextResponse.json({ events });
  } catch (error) {
    console.error('Error scraping events:', error);
    return NextResponse.json({ error: 'Failed to scrape events' }, { status: 500 });
  }
}
