<?php

namespace Web\MainBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Web\MainBundle\Entity\Favoris;
use Symfony\Component\HttpFoundation\Response;

class DefaultController extends Controller
{
	// Page d'accueil
    public function indexAction()
    {
        return $this->render('WebMainBundle:Default:index.html.twig');
    }

    // Page avec GMAP
    public function mapAction()
    {
        $favoris = new Favoris();

        $form = $this->createFormBuilder($favoris)
                        ->add('nomStation', 'text')
                        ->getForm();

    	return $this->render('WebMainBundle:Default:map.html.twig', array(
            'form' => $form->createView(),
        ));
    }

    // Page avec favoris
    public function favorisAction()
    {

        // Current user
        $user = $this->container->get('security.context')->getToken()->getUser();
       
        $repo = $this->getDoctrine()->getManager()->getRepository('WebMainBundle:Favoris');

        $favoris = $repo->getUserFavori($user);

        return $this->render('WebMainBundle:Default:favoris.html.twig', array(
             'favoris' => $favoris
        ));
    }

    // Ajout d'un favoris
    public function addFavoriAction()
    {
        $user = $this->container->get('security.context')->getToken()->getUser();
        $request = $this->get('request');

        if( $request->getMethod() == 'POST' )
        {
            $favoris = new Favoris();
            $nomStation = $_POST['form']['nomStation'];
            $favoris->setNomStation($nomStation);
            $favoris->addUser($user);

            $manager = $this->getDoctrine()->getManager();
            $manager->persist($favoris);
            $manager->flush();

            return $this->redirect($this->generateUrl('index'));
        }
        else {
            return new Response('Error');
        }
    }

    public function deleteFavoriAction($id)
    {
        $user = $this->container->get('security.context')->getToken()->getUser();
         // Si l'utilisateur n'est pas connecté, on le redirige
        if (!is_object($user)):
            return $this->redirect($this->generateUrl('fos_user_security_login'));
        endif;

        $em = $this->getDoctrine()->getManager();
        $repo = $this->getDoctrine()->getManager()->getRepository('WebMainBundle:Favoris');
        $favoris = $repo->getSpecificUserFavori($user, $id);
        $em->remove($favoris[0]);
        $em->flush();

        return new Response('Favoris supprimé');
    }
}
