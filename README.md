# Gradient Generator

A beautiful and intuitive gradient generator that creates Tailwind CSS v4 code for linear, radial, and conic gradients.

## Features

- **Multiple Gradient Types**: Linear, radial, and conic gradients
- **Advanced Color Picker**: Professional color selection with react-colorful
- **Tailwind CSS v4 Support**: Generates modern Tailwind CSS v4 gradient classes
- **Interpolation Modes**: Support for different color interpolation modes (sRGB, HSL, OKLab, OKLCH, etc.)
- **Live Preview**: Real-time gradient preview as you make changes
- **Copy to Clipboard**: One-click copying of generated CSS and Tailwind classes
- **Responsive Design**: Works perfectly on desktop and mobile devices

## Technology Stack

- **React 18** with TypeScript
- **Tailwind CSS v4** (alpha)
- **Vite** for fast development and building
- **react-colorful** for professional color picking
- **Radix UI** components via shadcn/ui
- **Lucide React** for icons
- **Sonner** for toast notifications

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd gradient-generator
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open your browser and navigate to `http://localhost:3000`

### Building for Production

```bash
npm run build
# or
yarn build
# or
pnpm build
```

## Usage

1. **Select Gradient Type**: Choose between linear, radial, or conic gradients
2. **Choose Colors**: Use the color picker to select your gradient colors
3. **Adjust Settings**: Modify angles, positions, and other gradient properties
4. **Set Interpolation**: Choose color interpolation mode for advanced effects
5. **Copy Code**: Copy the generated Tailwind CSS or plain CSS code

## Project Structure

```
├── src/
│   ├── components/
│   │   ├── GradientGenerator.tsx  # Main gradient generator component
│   │   ├── ui/                    # Reusable UI components (shadcn/ui)
│   │   └── figma/                 # Figma-specific components
│   ├── styles/
│   │   └── globals.css           # Global styles and Tailwind config
│   ├── App.tsx                   # Main app component
│   └── main.tsx                  # React entry point
├── public/                       # Static files
├── index.html                    # HTML entry point
└── Configuration files...
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Tailwind CSS](https://tailwindcss.com) for the amazing utility-first CSS framework
- [react-colorful](https://github.com/omgovich/react-colorful) for the excellent color picker
- [Radix UI](https://radix-ui.com) for the accessible UI primitives
- [shadcn/ui](https://ui.shadcn.com) for the beautiful component library