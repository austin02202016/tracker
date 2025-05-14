import type { DailyReview } from "./supabase"

// Generate dates for the last 30 days
const generateDates = (days: number) => {
  const dates: string[] = []
  const today = new Date()

  for (let i = 0; i < days; i++) {
    const date = new Date()
    date.setDate(today.getDate() - i)
    dates.push(date.toISOString().split("T")[0])
  }

  return dates.reverse() // Oldest first
}

// Generate mock highlights
const highlights = [
  "Completed a 5k run and felt great!",
  "Wrote a blog post about productivity habits.",
  "Had a productive meeting with the team.",
  "Learned a new programming concept.",
  "Meditated for 20 minutes and felt refreshed.",
  "Finished reading a book on personal development.",
  "Cooked a healthy meal and meal prepped for the week.",
  "Connected with an old friend.",
  "Solved a challenging problem at work.",
  "Took a nature walk and practiced mindfulness.",
]

// Generate mock transcripts
const transcripts = [
  "Today was a productive day. I woke up early and got a good workout in before starting work. I made progress on the main project and had a good meeting with the team. In the evening, I spent some time reading and went to bed on time.",

  "I struggled a bit with motivation today but managed to get the essential tasks done. I missed my morning workout but plan to make up for it tomorrow. I did spend some quality time working on my side project which felt rewarding.",

  "Great day overall! I stuck to my morning routine and had high energy throughout the day. I completed all my planned tasks and even had time for a short walk in the evening. I'm feeling good about my progress on building consistent habits.",

  "Today was challenging. I overslept and missed my morning alarm, which threw off my whole routine. I still managed to get some work done but didn't feel as productive as usual. Tomorrow I'll try to get back on track with my morning routine.",

  "I had an insight today about how to approach my current project more efficiently. I spent some time reorganizing my workflow and I think it will save me a lot of time going forward. I also managed to fit in a quick workout between meetings.",
]

// Generate mock data with patterns
export const generateMockData = (): DailyReview[] => {
  const dates = generateDates(30)

  // Create patterns
  const workoutPattern = [
    true,
    false,
    true,
    true,
    false, // Week 1
    true,
    false,
    true,
    false,
    true, // Week 2
    false,
    true,
    true,
    false,
    true, // Week 3
    true,
    true,
    false,
    true,
    true, // Week 4
    false,
    true,
    true,
    true,
    false, // Week 5
    true,
    true,
    true,
    false,
    true, // Week 6
  ]

  const contentPattern = [
    true,
    true,
    false,
    false,
    true, // Week 1
    false,
    true,
    true,
    false,
    false, // Week 2
    true,
    false,
    true,
    true,
    false, // Week 3
    false,
    true,
    false,
    true,
    true, // Week 4
    true,
    false,
    true,
    false,
    true, // Week 5
    true,
    true,
    false,
    true,
    false, // Week 6
  ]

  const alarmPattern = [
    true,
    true,
    true,
    false,
    true, // Week 1
    true,
    true,
    true,
    true,
    false, // Week 2
    true,
    false,
    true,
    true,
    true, // Week 3
    false,
    true,
    true,
    true,
    true, // Week 4
    true,
    true,
    false,
    true,
    true, // Week 5
    true,
    true,
    true,
    true,
    false, // Week 6
  ]

  const bedtimePattern = [
    false,
    true,
    true,
    true,
    false, // Week 1
    true,
    false,
    true,
    true,
    false, // Week 2
    true,
    true,
    false,
    true,
    true, // Week 3
    false,
    true,
    true,
    false,
    true, // Week 4
    true,
    false,
    true,
    true,
    false, // Week 5
    true,
    true,
    false,
    true,
    true, // Week 6
  ]

  const testPattern = [
    true,
    false,
    false,
    true,
    true, // Week 1
    false,
    true,
    false,
    true,
    true, // Week 2
    false,
    true,
    true,
    false,
    false, // Week 3
    true,
    false,
    true,
    true,
    false, // Week 4
    true,
    true,
    false,
    false,
    true, // Week 5
    false,
    true,
    true,
    true,
    false, // Week 6
  ]

  return dates.map((date, index) => {
    // Create some days with all habits completed and some with none
    // to demonstrate the full range of the color scale
    if (index === 7 || index === 21) {
      return {
        id: index + 1,
        date,
        transcript: transcripts[0],
        lift: true,
        content: true,
        highlights: "Completed all habits today! Feeling accomplished.",
        "730_alarm": true,
        "1045_bed": true,
        Test: true,
      }
    }

    if (index === 3 || index === 15) {
      return {
        id: index + 1,
        date,
        transcript: transcripts[3],
        lift: false,
        content: false,
        highlights: "Tough day today. Will try again tomorrow.",
        "730_alarm": false,
        "1045_bed": false,
        Test: false,
      }
    }

    // Add transcripts to some days
    const hasTranscript = index % 5 === 0
    const transcriptIndex = Math.floor(Math.random() * transcripts.length)

    return {
      id: index + 1,
      date,
      transcript: hasTranscript ? transcripts[transcriptIndex] : null,
      lift: workoutPattern[index],
      content: contentPattern[index],
      highlights: Math.random() > 0.3 ? highlights[index % highlights.length] : null,
      "730_alarm": alarmPattern[index],
      "1045_bed": bedtimePattern[index],
      Test: testPattern[index],
    }
  })
}

export const mockReviews = generateMockData()
