// CommentSection.tsx

import { useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.VITE_SUPABASE_URL!, process.env.VITE_SUPABASE_KEY!);

function CommentSection() {
  useEffect(() => {
    const commentSubscription = supabase
      .from('comments').on('*', payload => {
        console.log('Change received!', payload);
        // payload.new -> Yeni yorum eklendiğinde alınan veri
        // payload.old -> Yorum silindiğinde alınan veri
      })
      .subscribe();

    return () => {
      supabase.removeSubscription(commentSubscription);
    };
  }, []);

  return <div>{/* Comment rendering logic here */}</div>;
}
