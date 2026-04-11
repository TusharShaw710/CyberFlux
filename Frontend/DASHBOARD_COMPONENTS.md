# CyberFlux Dashboard UI - Component Documentation

## Overview

CyberFlux is a futuristic AI chat application UI built with React and Tailwind CSS, featuring cyberpunk styling with glassmorphism effects.

## Component Structure

### 📁 Components Directory: `src/features/chats/components/`

#### 1. **Dashboard.jsx** (Main Entry Point)

- Combines Sidebar and MainLayout
- Manages overall layout structure
- Integrates WebSocket connection via `useChat` hook

```jsx
import { DashBoard } from "@/features/chats/pages/Dashboard";
```

#### 2. **Sidebar.jsx**

- Fixed-width left navigation panel
- Features:
  - Logo + "CyberFlux Interface" branding
  - New Chat button with hover glow effect
  - User profile section at bottom
- Width: `w-64` (256px)

#### 3. **ChatHeader.jsx**

- Top navigation bar
- Features:
  - Tabs for "Models" and "Settings"
  - System status indicator (green dot)
  - Right-aligned profile icon

#### 4. **MainLayout.jsx**

- Main chat interface container
- Features:
  - Hero section with gradient heading
  - Dynamic message display
  - Background gradient overlays with glow effects

#### 5. **MessageBubble.jsx**

- Reusable message component
- Props:
  - `message` (string): Message content
  - `isUser` (boolean): User vs AI message styling
- User messages: Right-aligned, light background
- AI messages: Left-aligned, teal border with glow

#### 6. **ChatInput.jsx**

- Fixed bottom input bar
- Features:
  - Text input field with focus effects
  - Attachment button (left)
  - Send button with gradient (right)
  - Keyboard support (Enter to send)

#### 7. **UserProfile.jsx**

- User info card at sidebar bottom
- Features:
  - Avatar with gradient background
  - Name and status display
  - Logout button (appears on hover)

## Color Scheme

| Name        | Hex Code  | Usage                                  |
| ----------- | --------- | -------------------------------------- |
| Neon Mint   | `#00FFC2` | Primary accents, focus states, buttons |
| Cyber Pink  | `#FF00E5` | Secondary accents, links               |
| Blue Accent | `#3D5AFE` | Gradients, highlights                  |
| Dark Base   | `#0D0D12` | Background color                       |

## Tailwind Configuration

Custom colors added to `tailwind.config.js`:

```js
neon: {
  mint: '#00FFC2',
  pink: '#FF00E5',
  blue: '#3D5AFE',
},
dark: {
  base: '#0D0D12',
}
```

## Key Features

### 1. **Glassmorphism**

- `backdrop-blur-lg` for frosted glass effect
- `bg-white/5` for subtle transparency
- `border border-white/10` for soft borders

### 2. **Neon Glow Effects**

- Box shadows: `shadow-lg shadow-[#00FFC2]/50`
- Hover transitions with glow expansion
- Gradient text effects

### 3. **Responsive Design**

- Mobile-first approach
- Breakpoints: `md:` (768px), `lg:` (1024px)
- Sidebar hidden on mobile (can be toggled)

### 4. **Animations**

- Smooth transitions: `transition-all duration-300`
- Hover effects on buttons and inputs
- Loading indicators with pulse animation
- Icon rotation on interaction

## Usage Examples

### Using the Dashboard

```jsx
import { DashBoard } from "@/features/chats/pages/Dashboard";

export default function App() {
  return <DashBoard />;
}
```

### Using Individual Components

```jsx
import { MessageBubble, ChatInput } from "@/features/chats/components";

function ChatView() {
  return (
    <>
      <MessageBubble message="Hello!" isUser={false} />
      <ChatInput onSend={(msg) => console.log(msg)} />
    </>
  );
}
```

## Styling Details

### Buttons

All buttons use:

- Rounded corners: `rounded-xl` or `rounded-2xl`
- Smooth transitions: `transition-all duration-300`
- Custom hover states with glow

### Input Fields

- Background: `bg-white/5 backdrop-blur-lg`
- Border: `border-white/20` with focus: `border-[#00FFC2]/50`
- Focus glow: `shadow-[#00FFC2]/20`

### Message Bubbles

- User: `bg-white/10 backdrop-blur-lg border border-white/20`
- AI: `bg-black/40 border border-[#00FFC2]/30` with glow shadow

## Browser Support

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support (with -webkit prefixes in CSS)

## Performance Optimizations

1. **CSS-in-JS**: Tailwind for minimal bundle size
2. **Lazy Loading**: Components can be code-split
3. **Smooth Scrolling**: CustomScrollbar styling
4. **Efficient Re-renders**: React.memo for pure components

## Customization

### Change Theme Colors

Edit `tailwind.config.js` colors section:

```js
neon: {
  mint: '#YOUR_COLOR',
  pink: '#YOUR_COLOR',
  blue: '#YOUR_COLOR',
}
```

### Adjust Sidebar Width

In `Sidebar.jsx`:

```jsx
<div className="w-64"> {/* Change 64 to desired width */}
```

### Modify Hero Section

Edit `MainLayout.jsx` hero section content and styling.

## Known Limitations

- Scrollbar styling may vary across browsers
- Full support requires modern browser with CSS backdrop-filter
- Mobile responsiveness can be enhanced with hamburger menu

## Future Enhancements

- [ ] Message reactions/emojis
- [ ] Voice input support
- [ ] Dark/Light theme toggle
- [ ] Custom avatar uploads
- [ ] Message search functionality
- [ ] Chat history sidebar
- [ ] Real-time AI typing indicator

---

**Last Updated**: March 2026
**Built with**: React 18+, Tailwind CSS 3+, Lucide Icons
