import pandas as pd
import uuid
import sqlalchemy as db

# imort csv into master datafrsame and drop unneccessary columns and duplicates
df = pd.read_csv('codefoo.csv')
df = df.drop_duplicates(subset='content_id')
columnsToDrop = ['thumbnail_1_size', 'thumbnail_1_width', 'thumbnail_1_height',
                 'thumbnail_2_size', 'thumbnail_2_width', 'thumbnail_2_height',
                 'thumbnail_3_size', 'thumbnail_3_width', 'thumbnail_3_height',
                 'state', 'Unnamed: 0', 'description.1']
df.drop(columns=columnsToDrop, inplace=True)
df = df.apply(lambda x: x.astype(str).str.strip())

# create tags table and unique identifiers
tag_1_df = df[df['tag_1'] != 'NaN'][['tag_1', 'content_id']].rename(columns={'tag_1':'tag'})
tag_2_df = df[df['tag_2'] != 'NaN'][['tag_2', 'content_id']].rename(columns={'tag_2':'tag'})
tag_3_df = df[df['tag_3'] != 'NaN'][['tag_3', 'content_id']].rename(columns={'tag_3':'tag'})
tags_df = tag_1_df.append(tag_2_df).append(tag_3_df)

#df used to join content_id with tag_id based on tag name
intermediate_df = tags_df

#creates df of all exisiting tags with id, and all edges between content and tags
tags_df = tags_df.drop_duplicates(subset='tag').drop(columns=['content_id'])
tags_df['tag_id'] = [uuid.uuid4().hex for x in range(len(tags_df))]
tag_relations_df = tags_df.merge(intermediate_df, on='tag')[['content_id', 'tag_id']]

# - Drop columns that are not relevant to articles and visa versa
articles_df = df[df['content_type'] == 'article']
articles_df.drop(columns=['title', 'duration', 'video_series', 'content_type'],
                inplace=True)

videos_df = df[df['content_type'] == 'video']
videos_df.drop(columns=['headline', 'content_type', 'author_1', 'author_2'],
               inplace=True)

# Create two tables to store author data
authors_df = articles_df[['content_id', 'author_1']].rename(columns={'author_1' : 'author'})
authors_df['order'] = 1
authors_2_df = articles_df[articles_df['author_2'] != 'nan'][['content_id', 'author_2']].rename(columns={'author_2' : 'author'})
authors_2_df['order'] = 2
authors_df = authors_df.append(authors_2_df)

authors_df['author_id'] = [uuid.uuid4().hex for x in range(len(authors_df))]
author_names_df = authors_df.rename(columns={'author':'name'}).drop(columns=['content_id', 'order'])
author_names_df['name'] = author_names_df['name'].apply(lambda x: x.lower())
authors_df.drop(columns=['author'], inplace=True)

# - drop columns in articles and videos that are handled by new tables
articles_df.drop(columns=['author_1', 'author_2', 'tag_1', 'tag_2', 'tag_3'], inplace=True)
videos_df.drop(columns=['tag_1', 'tag_2', 'tag_3'], inplace=True)

############# - Pushing Pandas DFs to MySQL - #############
engine = db.create_engine('removed')
articles_df.to_sql('articles', engine, if_exists='replace', index=False)
videos_df.to_sql('videos', engine, if_exists='replace', index=False)
tags_df.to_sql('tags', engine, if_exists='replace', index=False)
tag_relations_df.to_sql('tag_relations', engine, if_exists='replace', index=False)
authors_df.to_sql('author_relations', engine, if_exists='replace', index=False)
author_names_df.to_sql('authors', engine, if_exists='replace', index=False)
