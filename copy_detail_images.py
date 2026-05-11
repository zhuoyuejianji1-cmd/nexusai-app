import json
import os
import shutil

# 源目录和目标目录
source_images_dir = 'c:/Users/wenzai/Desktop/ai数据网/projects/shujuzhuanqu-youyouyunchang/data/images'
target_images_dir = 'c:/Users/wenzai/Desktop/ai数据网/projects/public/images'
courses_json_path = 'c:/Users/wenzai/Desktop/ai数据网/projects/src/app/premium/courses.json'

print('='*60)
print('🚀 开始处理详情图片...')
print('='*60)

# 读取课程数据
print('\n📂 正在读取课程数据...')
with open(courses_json_path, encoding='utf-8') as f:
    data = json.load(f)

print(f'✅ 已加载 {len(data)} 门课程')

# 统计
copied_count = 0
fixed_count = 0
error_count = 0

# 处理每个课程
for course in data:
    detail_images = course.get('detailImages', [])
    
    if not detail_images:
        continue
    
    new_detail_images = []
    
    for img_path in detail_images:
        # 如果是爬虫目录的相对路径，转换为项目路径
        if img_path.startswith('./data/images/'):
            # 提取路径部分：./data/images/113150/xxx.png
            relative_path = img_path.replace('./data/images/', '')
            
            # 分割出课程ID和文件名
            parts = relative_path.split('/', 1)
            if len(parts) == 2:
                course_id = parts[0]  # 113150
                filename = parts[1]   # xxx.png
                
                source_path = os.path.join(source_images_dir, course_id, filename)
                target_dir = os.path.join(target_images_dir, course_id)
                target_path = os.path.join(target_dir, filename)
                
                # 创建课程图片目录
                if not os.path.exists(target_dir):
                    os.makedirs(target_dir)
                
                # 复制图片
                if os.path.exists(source_path):
                    if not os.path.exists(target_path):
                        shutil.copy2(source_path, target_path)
                        copied_count += 1
                    
                    # 使用项目中的路径
                    new_detail_images.append(f'/images/{course_id}/{filename}')
                    fixed_count += 1
                else:
                    error_count += 1
                    print(f'⚠️  找不到图片: {source_path}')
                    # 保留原路径
                    new_detail_images.append(img_path)
            else:
                new_detail_images.append(img_path)
        else:
            # 已经是正确路径，保留
            new_detail_images.append(img_path)
    
    # 更新课程的详情图片路径
    course['detailImages'] = new_detail_images

# 保存修正后的数据
print('\n💾 正在保存修正后的数据...')
with open(courses_json_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f'\n✨ 处理完成！')
print(f'📊 统计信息:')
print(f'   复制图片: {copied_count} 张')
print(f'   修正路径: {fixed_count} 个')
print(f'   错误数量: {error_count} 个')
print('\n' + '='*60)
print('✨ 全部完成！')
print('='*60)
