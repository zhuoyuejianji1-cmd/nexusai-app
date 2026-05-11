import json

# 读取课程数据
data_path = 'c:/Users/wenzai/Desktop/ai数据网/projects/src/app/premium/courses.json'
with open(data_path, encoding='utf-8') as f:
    data = json.load(f)

print(f'总课程数: {len(data)}')

# 检查前5个课程的详情图片
print('\n检查详情图片:')
print('='*60)
for i in range(min(5, len(data))):
    course = data[i]
    print(f'\n课程 {i+1}: {course["title"]}')
    print(f'  detailImages: {course.get("detailImages", [])}')

# 统计详情图片情况
has_detail_images = sum(1 for c in data if c.get('detailImages') and len(c['detailImages']) > 0)
total_detail_images = sum(len(c.get('detailImages', [])) for c in data)

print(f'\n详情图片统计:')
print(f'  有详情图的课程: {has_detail_images}/{len(data)} ({has_detail_images/len(data)*100:.1f}%)')
print(f'  详情图片总数: {total_detail_images}')

# 检查爬虫原始数据
print('\n检查爬虫原始数据中的详情图片:')
articles_path = 'c:/Users/wenzai/Desktop/ai数据网/projects/shujuzhuanqu-youyouyunchang/data/articles.json'
try:
    with open(articles_path, encoding='utf-8') as f:
        articles = json.load(f)
    
    print(f'  文章总数: {len(articles)}')
    
    # 检查前3篇文章的详情图片
    for i in range(min(3, len(articles))):
        article = articles[i]
        print(f'\n  文章 {i+1}: {article.get("title", "")}')
        print(f'    detail_images: {article.get("detail_images", [])}')
        print(f'    local_images: {article.get("local_images", [])}')
except Exception as e:
    print(f'  无法读取爬虫数据: {e}')
