import os

from google.appengine.ext import webapp
from google.appengine.ext.webapp import template
from google.appengine.ext.webapp.util import run_wsgi_app

import feedparser
from django.utils import simplejson as json



class MainPage(webapp.RequestHandler):
        def get(self):
                template_values = {
                }
                
                path = os.path.join(os.path.dirname(__file__),'index.html')
                self.response.out.write(template.render(path,template_values))
                

class FeedSource(webapp.RequestHandler):
        def get(self):
                category = self.request.get("category")

                mapper = {
                        'cat1' : 'http://www.ntvmsnbc.com/id/24927681/device/rss/rss.xml',
                        'cat2' : 'http://www.ntvmsnbc.com/id/24927482/device/rss/rss.xml',
                        'cat3' : 'http://www.ntvmsnbc.com/id/24927532/device/rss/rss.xml',
                        'cat4' : 'http://www.ntvmsnbc.com/id/24928011/device/rss/rss.xml',
                        'cat5' : 'http://www.milliyet.com.tr/D/rss/rss/Rss_1.xml',
                        'cat6' : 'http://www.milliyet.com.tr/D/rss/rss/Rss_2.xml',
                        'cat7' : 'http://www.milliyet.com.tr/D/rss/rss/Rss_5.xml',
                        'cat8' : 'http://www.milliyet.com.tr/D/rss/rss/Rss_6.xml'
                }

                if mapper.has_key(category):
                  try:
                    d = feedparser.parse(mapper[category])
                    self.response.out.write(json.dumps([{"title": entry.title,"link":entry.link,"summary":entry.summary} for entry in d.entries]))
                  except:
                    self.response.out.write('unable to get feed for category:',category)

                else:
                  self.response.out.write('no category:'+category)


application = webapp.WSGIApplication([
        ('/',MainPage),
        ('/feed',FeedSource)],
        debug=True)

def main():
        run_wsgi_app(application)


if __name__ == '__main__':
        main()
