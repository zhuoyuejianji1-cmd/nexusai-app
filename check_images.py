import json
import os

# 读取课程数据
data_path = 'c:/Users/wenzai/Desktop/ai数据网/projects/src/app/premium/courses.json'
with open(data_path, encoding='utf-8') as f:
    data = json.load(f)

print(f'总课程数: {len(data)}')

# 检查前5个课程的图片路径
print('\n检查课程图片路径:')
print('='*60)
for i in range(min(5, len(data))):
    course = data[i]
    print(f'\n课程 {i+1}: {course["title"]}')
    print(f'  thumbnail: {course.get("thumbnail", "无")}')
    print(f'  detailImages: {course.get("detailImages", [])}')

# 统计图片情况
has_thumbnail = sum(1 for c in data if c.get('thumbnail'))
has_detail_images = sum(1 for c in data if c.get('detailImages') and len(c['detailImages']) > 0)

print(f'\n图片统计:')
print(f'  有封面图的课程: {has_thumbnail}/{len(data)} ({has_thumbnail/len(data)*100:.1f}%)')
print(f'  有详情图的课程: {has_detail_images}/{len(data)} ({has_detail_images/len(data)*100:.1f}%)')

# 检查图片路径格式
print('\n图片路径格式示例:')
for course in data[:3]:
    thumb = course.get('thumbnail', '')
    if thumb:
        print(f'  封面路径: {thumb}')
        break
