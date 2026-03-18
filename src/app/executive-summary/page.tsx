import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import 'katex/dist/katex.min.css';
import fs from 'fs';
import path from 'path';

export default function ExecutiveSummaryPage() {
  const filePath = path.join(process.cwd(), 'BlackSlon_Executive_Summary.md');
  const fileContent = fs.readFileSync(filePath, 'utf8');

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-40">
          <div className="flex justify-center mb-16">
            <a href="/" className="cursor-pointer">
              <img src="/BS_image.jpg" alt="BlackSlon" className="h-60 w-auto hover:opacity-80 transition-opacity" />
            </a>
          </div>
          <h1 className="text-4xl mb-6 text-amber-600 text-center">BlackSlon - Executive Summary</h1>
          <p className="text-gray-400 text-center">The New Architecture of European Energy Wholesale Markets</p>
        </div>

        <div className="prose prose-invert prose-headings:text-amber-500 prose-h1:text-amber-600 prose-h2:text-amber-500 prose-h3:text-amber-400 prose-p:text-gray-300 prose-li:text-gray-300 prose-strong:text-white prose-hr:border-gray-700 prose-blockquote:border-l-amber-500 prose-blockquote:text-gray-300 prose-a:no-underline prose-a:text-amber-400 hover:prose-a:text-amber-300 prose-code:text-amber-300 max-w-none">
          <ReactMarkdown 
            remarkPlugins={[remarkMath, remarkGfm]}
            rehypePlugins={[rehypeKatex]}
            components={{
              h1: ({ children, ...props }) => (
                <h1 id={children?.toString().toLowerCase().replace(/[^a-z0-9]+/g, '-')} {...props}>
                  {children}
                </h1>
              ),
              h2: ({ children, ...props }) => (
                <h2 id={children?.toString().toLowerCase().replace(/[^a-z0-9]+/g, '-')} {...props}>
                  {children}
                </h2>
              ),
              h3: ({ children, ...props }) => (
                <h3 id={children?.toString().toLowerCase().replace(/[^a-z0-9]+/g, '-')} {...props}>
                  {children}
                </h3>
              ),
              a: ({ href, children, ...props }) => (
                <a href={href} {...props}>
                  {children}
                </a>
              )
            }}
          >
            {fileContent}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
