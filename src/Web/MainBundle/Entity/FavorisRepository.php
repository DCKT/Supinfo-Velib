<?php

namespace Web\MainBundle\Entity;

use Doctrine\ORM\EntityRepository;

/**
 * FavorisRepository
 *
 * This class was generated by the Doctrine ORM. Add your own custom
 * repository methods below.
 */
class FavorisRepository extends EntityRepository
{
	public function getUserFavori($user)
	{
		$qb = $this->createQueryBuilder('a')
					->join('a.user', 'c', 'WITH', 'c.id = '.$user->getId());
		return $qb->getQuery()->getResult();
	}

	public function getSpecificUserFavori($user, $id)
	{
		$qb = $this->createQueryBuilder('a')
					->join('a.user', 'c', 'WITH', 'c.id = '.$user->getId())
					->where('a.id = '.$id);
		return $qb->getQuery()->getResult();
	}
}
