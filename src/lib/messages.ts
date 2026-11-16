/**
 * Rotating, encouraging copy for celebrations, toasts, and greetings.
 * Matches focusflow-expo's brand voice.
 */

const pick = <T>(list: T[]): T => list[Math.floor(Math.random() * list.length)]
const fill = (s: string, vars: Record<string, string | number>) =>
  s.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ''))

export const messages = {
  allDone: () =>
    pick([
      'Every habit checked. Sparky is doing a happy dance!',
      '100% complete. Enjoy the rest of your day, you earned it.',
      'Perfect day! Small wins like this build big changes.',
      'All done for today. Future you says thank you.',
    ]),

  firstHabit: () =>
    pick([
      'Your first spark is lit. Let’s keep it burning!',
      'Habit #1 is in. Starting is the hardest part, and you just did it.',
    ]),

  habitAdded: (title: string) =>
    pick([`“${title}” added. You’ve got this!`, `“${title}” is on your list. Let’s go!`]),

  focusDone: (minutes: number) =>
    fill(
      pick([
        '{m} minutes of deep focus. Your brain thanks you.',
        'Session complete! Stretch, sip water, then back to winning.',
        '{m} focused minutes in the bank. Nicely done.',
        'That’s how progress happens: {m} minutes, fully present.',
      ]),
      { m: minutes }
    ),

  breakDone: () => pick(['Break’s over. Ready for another round?', 'Recharged! Let’s get back in the flow.']),

  badge: (description: string) =>
    pick([`${description}. Keep the fire going!`, `${description}. You’re on a roll!`]),

  greetingLine: (done: number, total: number) => {
    if (total === 0) return 'Add your first habit to light the fire.'
    if (done === 0) return 'A fresh day. Pick one habit and start small.'
    if (done >= total) return 'All done today. Your fire is blazing!'
    if (done / total >= 0.5) return 'More than halfway there. Keep flowing!'
    return 'Good start. Stay consistent, keep flowing!'
  },

  streak: (days: number) => {
    const milestones: Record<number, string> = {
      3: 'Three days in a row. A habit is taking shape!',
      7: 'One full week! You’re not trying anymore, you’re doing.',
      14: 'Two weeks strong. This is becoming who you are.',
      21: '21 days. This is where habits start to stick.',
      30: 'A whole month! Most people quit by day 3. You didn’t.',
      60: 'Sixty days. Discipline looks good on you.',
      100: '100 days. You’re officially unstoppable.',
      365: 'One full year. Legend status unlocked.',
    }
    return (
      milestones[days] ??
      fill(pick(['{n} days strong! Small steps, huge fire.', 'Day {n} done. You showed up again.']), {
        n: days,
      })
    )
  },
}
