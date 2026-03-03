import { useState } from 'react';
import { Box, Text, render } from 'ink';
import { GigglesProvider, Router, Screen, useNavigation, FocusScope, useFocusScope } from 'giggles';
import { Select, TextInput, Confirm } from 'giggles/ui';
import { Markdown } from 'giggles/markdown';

const menuItems = [
  { label: 'Greeting Generator', value: 'greeting' },
  { label: 'Contact Form', value: 'form' },
  { label: 'Help', value: 'help' },
  { label: 'Quit', value: 'quit' },
];

const greetings = [
  { label: 'Hello World', value: 'hello' },
  { label: 'Good Morning', value: 'morning' },
  { label: 'Good Evening', value: 'evening' },
  { label: 'Howdy Partner', value: 'howdy' },
];

const greetingMessages: Record<string, string> = {
  hello: 'Hello, World! Welcome to Giggles TUI!',
  morning: 'Good Morning! Have a wonderful day!',
  evening: 'Good Evening! Hope you had a great day!',
  howdy: 'Howdy Partner! Yeehaw!',
};

function GreetingScreen() {
  const nav = useNavigation();
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <Box flexDirection="column" gap={1}>
      <Text bold color="cyan">Greeting Generator</Text>
      <Text dimColor>Pick a greeting (j/k to move, Enter to select):</Text>
      <Select
        options={greetings}
        onSubmit={(val) => setSelected(val)}
      />
      {selected && (
        <Box marginTop={1} borderStyle="round" borderColor="green" paddingX={2}>
          <Text color="green">{greetingMessages[selected]}</Text>
        </Box>
      )}
      <Confirm
        message="Go back to menu?"
        onSubmit={(yes) => { if (yes) nav.pop(); }}
      />
    </Box>
  );
}

function FormScreen() {
  const nav = useNavigation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const scope = useFocusScope({
    keybindings: ({ next, prev }) => ({ tab: next, 'shift+tab': prev }),
  });

  if (submitted) {
    return (
      <Box flexDirection="column" gap={1}>
        <Text bold color="cyan">Submitted!</Text>
        <Box borderStyle="round" borderColor="green" paddingX={2} flexDirection="column">
          <Text>Name:  {name}</Text>
          <Text>Email: {email}</Text>
        </Box>
        <Confirm
          message="Go back to menu?"
          onSubmit={(yes) => { if (yes) nav.pop(); else setSubmitted(false); }}
        />
      </Box>
    );
  }

  return (
    <Box flexDirection="column" gap={1}>
      <Text bold color="cyan">Contact Form</Text>
      <Text dimColor>Tab to switch fields, Enter on last field to submit</Text>
      <FocusScope handle={scope}>
        <TextInput label="Name:" value={name} onChange={setName} placeholder="Jane Doe" />
        <TextInput
          label="Email:"
          value={email}
          onChange={setEmail}
          onSubmit={() => setSubmitted(true)}
          placeholder="jane@mail.com"
        />
      </FocusScope>
      <Confirm
        message="Go back to menu?"
        onSubmit={(yes) => { if (yes) nav.pop(); }}
      />
    </Box>
  );
}

const helpContent = `# Giggles TUI - Help

## Navigation
- **j/k** or **Up/Down** arrows to move through lists
- **Enter** to select an option
- **Tab/Shift+Tab** to switch between form fields
- **y/n** on confirm prompts

## Screens
- **Greeting Generator** - pick a greeting style
- **Contact Form** - fill in a simple form
- **Help** - you are here

## About
Built with **giggles** - a batteries-included React framework for terminal apps.
`;

function HelpScreen() {
  const nav = useNavigation();

  return (
    <Box flexDirection="column" gap={1}>
      <Markdown>{helpContent}</Markdown>
      <Confirm
        message="Go back to menu?"
        onSubmit={(yes) => { if (yes) nav.pop(); }}
      />
    </Box>
  );
}

function MainMenu() {
  const nav = useNavigation();

  return (
    <Box flexDirection="column" gap={1}>
      <Text bold color="magenta">  Giggles TUI  </Text>
      <Text dimColor>A terminal UI built with giggles + ink + react</Text>
      <Select
        options={menuItems}
        onSubmit={(val) => {
          if (val === 'quit') {
            process.exit(0);
          }
          nav.push(val);
        }}
      />
    </Box>
  );
}

function App() {
  return (
    <Router initialScreen="menu">
      <Screen name="menu" component={MainMenu} />
      <Screen name="greeting" component={GreetingScreen} />
      <Screen name="form" component={FormScreen} />
      <Screen name="help" component={HelpScreen} />
    </Router>
  );
}

render(
  <GigglesProvider>
    <App />
  </GigglesProvider>
);
