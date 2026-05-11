import json
import os

# 读取课程数据
data_path = 'c:/Users/wenzai/Desktop/ai数据网/projects/src/app/premium/courses.json'
with open(data_path, encoding='utf-8') as f:
    data = json.load(f)

print(f'总课程数: {len(data)}')
print(f'\n示例课程: {data[0]["title"]}')
print(f'讲师字段: "{data[0]["instructor"]}"')
print(f'有内容字段: {"content" in data[0]}')
print(f'有网盘链接: {"baiduLinks" in data[0]}')
print(f'有详情图片: {"detailImages" in data[0]}')
print(f'有封面图: {"thumbnail" in data[0]}')
print(f'有源码链接: {"sourceUrl" in data[0]}')

# 统计完整度
has_content = sum(1 for c in data if c.get('content'))
has_baidu = sum(1 for c in data if c.get('baiduLinks'))
has_images = sum(1 for c in data if c.get('detailImages'))
has_thumbnail = sum(1 for c in data if c.get('thumbnail'))

print(f'\n数据完整度统计:')
print(f'有完整内容: {has_content}/{len(data)} ({has_content/len(data)*100:.1f}%)')
print(f'有网盘链接: {has_baidu}/{len(data)} ({has_baidu/len(data)*100:.1f}%)')
print(f'有详情图片: {has_images}/{len(data)} ({has_images/len(data)*100:.1f}%)')
print(f'有封面图: {has_thumbnail}/{len(data)} ({has_thumbnail/len(data)*100:.1f}%)')
