import Link from 'next/link'

export default function FontTestPage() {
  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 text-foreground">Font Accessibility Test</h1>
          <p className="text-base sm:text-lg text-muted-foreground">
            This page tests font visibility and accessibility features on dark backgrounds
          </p>
        </div>

        {/* Font Family Tests */}
        <div className="space-y-4 sm:space-y-6">
          <div className="bg-card border border-border rounded-lg p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-card-foreground">Font Family Tests</h2>
            
            <div className="space-y-3 sm:space-y-4">
              <div>
                <h3 className="text-base sm:text-lg font-medium mb-2 text-card-foreground">Sans Serif (Geist Sans)</h3>
                <p className="text-sm sm:text-base text-card-foreground">
                  This is the default sans-serif font. It should be Geist Sans with proper fallbacks.
                  The quick brown fox jumps over the lazy dog. 0123456789
                </p>
              </div>
              
              <div>
                <h3 className="text-base sm:text-lg font-medium mb-2 text-card-foreground">Monospace (Geist Mono)</h3>
                <code className="text-sm sm:text-base font-mono bg-muted text-muted-foreground p-2 rounded block overflow-x-auto">
                  This is the monospace font. It should be Geist Mono.
                  const example = &quot;Hello World&quot;; // 0123456789
                </code>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2 text-card-foreground">Custom Font Classes</h3>
                <p className="font-satoshi text-base text-card-foreground">
                  This uses the custom .font-satoshi class with enhanced features.
                </p>
                <code className="font-jetbrains text-base bg-muted text-muted-foreground p-2 rounded block">
                  This uses the custom .font-jetbrains class for code.
                </code>
              </div>
            </div>
          </div>

          {/* Font Size Tests */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 text-card-foreground">Font Size Tests</h2>
            
            <div className="space-y-2">
              <p className="text-xs text-card-foreground">Extra Small (12px) - Minimum readable size</p>
              <p className="text-sm text-card-foreground">Small (14px) - Good for secondary text</p>
              <p className="text-base text-card-foreground">Base (16px) - Default body text</p>
              <p className="text-lg text-card-foreground">Large (18px) - Enhanced readability</p>
              <p className="text-xl text-card-foreground">Extra Large (20px) - Important text</p>
              <p className="text-2xl text-card-foreground">2XL (24px) - Section headings</p>
              <p className="text-3xl text-card-foreground">3XL (30px) - Page headings</p>
              <p className="text-4xl text-card-foreground">4XL (36px) - Hero text</p>
            </div>
          </div>

          {/* Font Weight Tests */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 text-card-foreground">Font Weight Tests</h2>
            
            <div className="space-y-2">
              <p className="font-light text-card-foreground">Light (300) - Subtle emphasis</p>
              <p className="font-normal text-card-foreground">Normal (400) - Default weight</p>
              <p className="font-medium text-card-foreground">Medium (500) - Enhanced emphasis</p>
              <p className="font-semibold text-card-foreground">Semibold (600) - Strong emphasis</p>
              <p className="font-bold text-card-foreground">Bold (700) - Maximum emphasis</p>
            </div>
          </div>

          {/* Accessibility Tests */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 text-card-foreground">Accessibility Features</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2 text-card-foreground">Focus Indicators</h3>
                <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md">
                  This button has visible focus indicators
                </button>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2 text-card-foreground">Color Contrast</h3>
                <p className="text-card-foreground">
                  This text should have sufficient contrast against the dark background.
                </p>
                <p className="text-muted-foreground">
                  This muted text should also be readable on dark backgrounds.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2 text-card-foreground">Line Height</h3>
                <p className="text-base leading-relaxed text-card-foreground">
                  This paragraph has relaxed line height for better readability.
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                  Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
              </div>
            </div>
          </div>

          {/* Responsive Text */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 text-card-foreground">Responsive Text</h2>
            
            <div className="space-y-2">
              <p className="text-sm md:text-base lg:text-lg text-card-foreground">
                This text scales with screen size for optimal readability.
              </p>
              <h3 className="text-lg md:text-xl lg:text-2xl font-semibold text-card-foreground">
                Responsive Heading
              </h3>
            </div>
          </div>

          {/* Dark Mode Specific Tests */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 text-card-foreground">Dark Mode Font Tests</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2 text-card-foreground">White Text on Dark Background</h3>
                <p className="text-card-foreground">
                  This white text should be clearly visible against the dark background.
                  The Geist font should render crisply and be easily readable.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2 text-card-foreground">Muted Text</h3>
                <p className="text-muted-foreground">
                  This muted text should still be readable but less prominent than the main text.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2 text-card-foreground">Code Blocks</h3>
                <code className="font-mono text-sm bg-muted text-muted-foreground p-3 rounded block">
                  {`function darkModeTest() {
  console.log("Fonts should be visible on dark backgrounds");
  return "Success!";
}`}
                </code>
              </div>
            </div>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center">
          <Link 
            href="/" 
            className="inline-flex items-center px-3 sm:px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-sm sm:text-base"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
} 