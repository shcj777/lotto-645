import React, { useEffect } from 'react';
import { MessageSquare } from 'lucide-react';

interface DisqusCommentsProps {
  url?: string;
  identifier?: string;
  title?: string;
}

export const DisqusComments: React.FC<DisqusCommentsProps> = ({
  url,
  identifier = 'lotto-645-main',
  title = '로또 6/45 행운의 번호 추첨기',
}) => {
  useEffect(() => {
    const pageUrl = url || (typeof window !== 'undefined' ? window.location.href : '');

    const win = window as unknown as {
      DISQUS?: {
        reset: (params: {
          reload: boolean;
          config?: (this: { page: { url: string; identifier: string; title: string } }) => void;
        }) => void;
      };
      disqus_config?: (this: { page: { url: string; identifier: string; title: string } }) => void;
    };

    win.disqus_config = function (this: { page: { url: string; identifier: string; title: string } }) {
      this.page.url = pageUrl;
      this.page.identifier = identifier;
      this.page.title = title;
    };

    if (win.DISQUS) {
      win.DISQUS.reset({
        reload: true,
        config: function (this: { page: { url: string; identifier: string; title: string } }) {
          this.page.url = pageUrl;
          this.page.identifier = identifier;
          this.page.title = title;
        },
      });
    } else {
      const script = document.createElement('script');
      script.src = 'https://sanghwa.disqus.com/embed.js';
      script.setAttribute('data-timestamp', String(+new Date()));
      script.async = true;
      (document.head || document.body).appendChild(script);
    }
  }, [url, identifier, title]);

  return (
    <div className="w-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-8 transition-colors">
      <div className="flex items-center gap-2.5 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-amber-600 dark:text-amber-400">
          <MessageSquare className="w-4 h-4" />
        </div>
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
            댓글 & 행운 나눔 공간
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            오늘 뽑은 행운의 번호나 당첨 기원 응원 한마디를 자유롭게 남겨보세요!
          </p>
        </div>
      </div>

      <div id="disqus_thread" className="min-h-[200px]" />

      <noscript>
        Please enable JavaScript to view the{' '}
        <a href="https://disqus.com/?ref_noscript" className="text-indigo-600 underline">
          comments powered by Disqus.
        </a>
      </noscript>
    </div>
  );
};
