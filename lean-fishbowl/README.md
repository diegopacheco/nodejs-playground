# Lean Fishbowl

**[Live Demo](https://htmlpreview.github.io/?https://github.com/diegopacheco/nodejs-playground/blob/claude/read-lean-fishbowl-sfXR7/lean-fishbowl/index.html)**

The Lean Fishbowl technique is a structured discussion format where one topic at a time occupies the center of attention (the "fishbowl"). A time-boxed timer keeps discussions focused and moving. When time runs out, the group decides to extend or mark the topic as done and move on.

## How to Run

```bash
npm start
```

Or just open `index.html` directly in any browser.

## Columns

- **Topics** (left): Add discussion topics here. Each card represents one idea or agenda item waiting to be discussed.
- **Talking** (middle): The active topic. Only one card lives here at a time. This is what the group is currently discussing.
- **Done** (right): Completed topics. Cards move here when discussion is finished.

## How the Timer Works

1. The timer defaults to 5 minutes.
2. Click the time display to edit it — type any number of minutes and press Enter.
3. Press **Start** to begin the countdown.
4. Press **Pause** to pause mid-discussion.
5. When the timer hits **0:00**, a modal appears with two options:
   - **Add 2 min** (or enter a custom amount) — extends the current discussion.
   - **Mark Done** — moves the card from Talking to Done automatically.

## Moving Cards

- Drag and drop cards between columns.
- Or use the arrow buttons on each card to move left/right.
